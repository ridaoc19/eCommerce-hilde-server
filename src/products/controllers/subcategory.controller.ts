import { Controller } from '@nestjs/common';
import { SubcategoryService } from '../services/subcategory.service';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private subcategoryService: SubcategoryService) {}
}
