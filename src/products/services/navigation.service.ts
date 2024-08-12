import { Injectable } from '@nestjs/common';
import { readExcelFile } from './utils';

@Injectable()
export class NavigationService {
  async uploadFile({ file }) {
    try {
      const data = await readExcelFile({ file });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
