import { Controller } from '@nestjs/common';
import { VariantService } from '../services/variant.service';

@Controller('variant')
export class VariantController {
  constructor(private variantService: VariantService) {}
}
