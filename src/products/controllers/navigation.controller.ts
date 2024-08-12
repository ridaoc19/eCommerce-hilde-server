import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { expectedKeys } from '../dtos/navigation.dto';
import { NavigationService } from '../services/navigation.service';
import { createExcel } from '../services/utils';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      const { data, errors } = await this.navigationService.uploadFile({ file: file.buffer });

      if (errors.length > 0) {
      }
      await createExcel({
        sheets: [
          { name: 'errors', header: ['value', 'error', 'address'], content: errors as any },
          {
            name: 'productos bueno',
            header: expectedKeys,
            content: data,
            cellsToColor: errors.map(({ address }) => ({ address })),
          },
        ],
        res,
      });
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      return { error: 'Error generating Excel file' };
    }
  }

  @Get()
  async generateExcel(@Res() res: Response) {
    try {
      const filePath = join(__dirname, '..', '..', '..', 'upload.json');
      const jsonData: NewData[] = JSON.parse(readFileSync(filePath, 'utf-8'));

      // Función para aplanar los datos
      const flattenData = (data: NewData[]): any[] => {
        const rows = [];
        data.forEach((dept) => {
          dept.children.forEach((cat) => {
            cat.children.forEach((subcat) => {
              subcat.children.forEach((product) => {
                product.variants.forEach((variant) => {
                  rows.push({
                    department: dept.department,
                    category: cat.category,
                    subcategory: subcat.subcategory,
                    product: product.product,
                    brand: product.brand,
                    benefits: product.benefits,
                    contents: product.contents,
                    description: product.description,
                    specifications: product.specification,
                    warranty: product.warranty,
                    breadcrumb: product.breadcrumb,
                    // variants: JSON.stringify(variant),
                    attributes: variant.attributes,
                    images: variant.images,
                    listPrice: variant.listPrice,
                    price: variant.price,
                    stock: variant.stock,
                    videos: variant.videos,
                  });
                });
              });
            });
          });
        });
        return rows;
      };

      // Añadir filas a la hoja
      const rows = flattenData(jsonData.splice(0, 2));
      await createExcel({
        sheets: [
          { name: 'nuevos productos', header: expectedKeys, content: rows },
          // {
          //   name: 'segundo productos',
          //   header: expectedKeys,
          //   content: rows,
          //   // cellsToColor: [{ address: 'M3' }, { address: 'J4' }, { address: 'A3' }],
          // },
        ],
        res,
      });
      res.end();
    } catch (error) {
      return { error: 'Error generating Excel file' };
    }
  }
}

interface NewData {
  department: string;
  children: Child3[];
}

interface Child3 {
  category: string;
  children: Child2[];
}

interface Child2 {
  subcategory: string;
  children: Child[];
}

interface Child {
  productId: string;
  product: string;
  brand: string;
  benefits: string[];
  category: string;
  contents: string;
  department: string;
  description: string;
  specification: Specification;
  subcategory: string;
  warranty: string;
  breadcrumb: string[];
  variants: Variant[];
}

interface Variant {
  itemId: string;
  attributes: Attributes;
  images: string[];
  listPrice: number;
  price: number;
  stock: number;
  videos: string[];
}

type Attributes = Record<string, string>;

type Specification = Record<string, string>;
