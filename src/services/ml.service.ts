import ApplicationError from '@/errors/application.error';
import { PRODUCT_BUCKET_NAME } from '@/lib/config';
import { MLRepository, IUpdateNgrok, GetNgrokOption } from '@/repositories/ml.repository';
import { bucket } from '@/utils/storage';
import prisma from '@/lib/database/prisma';
import axios from 'axios';
import { SearchByQueryRequest, SearhByImageRequest } from '@/domain/dtos/ml.dto';
import ProductService from '@/services/product.service';
import { NgrokType } from '@prisma/client';

export interface VitonOption {
  vtonUrl: string;
  productId: string;
  category: string;
}

class MLService {
  constructor(
    private mlRepository: MLRepository,
    private productService: ProductService,
  ) {}
  async updateNgrok(data: IUpdateNgrok) {
    return await this.mlRepository.updateNgrok(data);
  }

  async getNgrok(option: GetNgrokOption) {
    return await this.mlRepository.getNgrok(option);
  }

  uploadImage = async file => {
    try {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      await new Promise((resolve, reject) => {
        blobStream.on('finish', resolve);
        blobStream.on('error', reject);
        blobStream.end(file.buffer);
      });

      return { imageUrl: `https://storage.googleapis.com/${PRODUCT_BUCKET_NAME}/${blob.name}` };
    } catch (e) {
      throw new ApplicationError(e.message);
    }
  };

  async searchByImage({ imageUrl }: SearhByImageRequest) {
    const ngrokUrl = await prisma.ngrokUrl.findFirst({
      where: {
        type: NgrokType.DEFAULT,
      },
    });
    if (!ngrokUrl) throw new ApplicationError('Ngrok URL not found');
    const form = new FormData();
    form.append('image_url', imageUrl);
    const [similarProductsResponse, categoryResponse] = await Promise.all([
      axios.post(`${ngrokUrl.name}/image_search`, form),
      axios.post(`${ngrokUrl.name}/predict_classification`, form),
    ]);
    const similarProductIDs = similarProductsResponse.data.result as string[];
    const category = categoryResponse.data.predicted_label as string;
    const productIDs = similarProductIDs.map(productID => parseInt(productID));
    const similarProducts = await this.productService.getAll({ ids: productIDs, take: 20 });
    return { category, similarProducts };
  }

  async searchByQuery({ query }: SearchByQueryRequest) {
    const ngrokUrl = await prisma.ngrokUrl.findFirst({
      where: {
        type: NgrokType.DEFAULT,
      },
    });
    if (!ngrokUrl) throw new ApplicationError('Ngrok URL not found');
    const response = await axios.get(`${ngrokUrl.name}/search`, { params: { query } });
    const similarProductIDs = response.data.result;
    const productIDs = similarProductIDs.map(productID => parseInt(productID));
    const products = await this.productService.getAll({ ids: productIDs, take: 20 });
    return { products };
  }

  async vton(option: VitonOption) {
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(option.productId),
      },
      select: {
        images: true,
      },
    });

    const ngrokUrl = await prisma.ngrokUrl.findFirst({
      where: {
        type: NgrokType.VTON,
      },
    });

    if (!ngrokUrl) {
      throw new Error('Ngrok URL not found');
    }

    const garmUrl = product.images[product.images.length - 1];

    const formData = new FormData();
    formData.append('vton_url', option.vtonUrl);
    formData.append('garm_url', garmUrl);
    formData.append('category', option.category);

    const response = await axios.post(`${ngrokUrl.name}/process_dc`, formData);
    return response.data;
  }
}
export default MLService;
