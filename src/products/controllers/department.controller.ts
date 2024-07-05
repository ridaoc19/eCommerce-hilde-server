import { Controller } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';

@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}
}
