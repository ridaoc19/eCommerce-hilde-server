import { PickType } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CellValue, Workbook } from 'exceljs';
import { Response } from 'express';
import {
  NavigationCreateCategoryDto,
  NavigationCreateDepartmentDto,
  NavigationCreateProductDto,
  NavigationCreateSubcategoryDto,
  NavigationCreateVariantDto,
  NavigationProductsDto,
  title,
} from '../dtos/navigation.dto';

//! Función para convertir un índice a una letra de acuerdo con el alfabeto
function indexToLetter(index: number) {
  let letters = '';
  while (index >= 0) {
    letters = String.fromCharCode((index % 26) + 65) + letters;
    index = Math.floor(index / 26) - 1;
  }
  return letters;
}

// !//////////////////7

export const parseData = ({ value }: { value: CellValue }) => {
  if (typeof value === 'string') {
    // Eliminar espacios en blanco al inicio y al final
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return value;
    }
    // Verificar si la cadena parece un JSON incompleto
    const looksLikeIncompleteJSON =
      (trimmedValue.startsWith('{') && !trimmedValue.endsWith('}')) ||
      (trimmedValue.endsWith('}') && !trimmedValue.startsWith('{')) ||
      (trimmedValue.startsWith('[') && !trimmedValue.endsWith(']')) ||
      (trimmedValue.endsWith(']') && !trimmedValue.startsWith('['));

    if (looksLikeIncompleteJSON) {
      // Si parece un JSON incompleto, devolverlo como un objeto o array vacío
      return trimmedValue.startsWith('{') || (trimmedValue.endsWith('}') && undefined);
    }

    // Intentar parsear el JSON
    try {
      const parsedValue = JSON.parse(trimmedValue);
      return parsedValue;
    } catch (error) {
      // Si la cadena no es un JSON válido, intentar parsear primitivas
      if (!isNaN(Number(trimmedValue))) {
        // Verificar si es un número
        return Number(trimmedValue);
      } else if (trimmedValue.toLowerCase() === 'true') {
        // Verificar si es un booleano true
        return true;
      } else if (trimmedValue.toLowerCase() === 'false') {
        // Verificar si es un booleano false
        return false;
      }
    }
  }
  return value;
};

// ! ////////
interface ValidateValueReturnError {
  value: CellValue;
  error: string;
  address: string;
}

interface ValidateValueReturnValue {
  [key: string]: CellValue;
}

interface ValidateValueProps {
  [key: string]: { address: string; value: CellValue };
}

export type ContentReturn = { data: ValidateValueReturnValue[]; errors: ValidateValueReturnError[] };

type Content = (data: ValidateValueProps[]) => Promise<ContentReturn>;

export const validateValue: Content = async (oldData) => {
  const data: ValidateValueReturnValue[] = [];
  const errors: ValidateValueReturnError[] = [];

  for (const item of oldData) {
    const dataSection: ValidateValueReturnValue = {} as ValidateValueReturnValue;
    for (const [key, { address, value: oldValue }] of Object.entries(item)) {
      const value = parseData({ value: oldValue });
      let rowDataDTO: any;
      switch (key as keyof NavigationProductsDto) {
        case 'department':
          rowDataDTO = plainToClass(NavigationCreateDepartmentDto, { [key]: value });
          break;
        case 'category':
          rowDataDTO = plainToClass(NavigationCreateCategoryDto, { [key]: value });
          break;
        case 'subcategory':
          rowDataDTO = plainToClass(NavigationCreateSubcategoryDto, { [key]: value });
          break;
        case 'product':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['product']), { [key]: value });
          break;
        case 'brand':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['brand']), { [key]: value });
          break;
        case 'description':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['description']), { [key]: value });
          break;
        case 'benefits':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['benefits']), { [key]: value });
          break;
        case 'contents':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['contents']), { [key]: value });
          break;
        case 'warranty':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['warranty']), { [key]: value });
          break;
        case 'specifications':
          rowDataDTO = plainToClass(PickType(NavigationCreateProductDto, ['specifications']), { [key]: value });
          break;
        case 'images':
          rowDataDTO = plainToClass(PickType(NavigationCreateVariantDto, ['images']), { [key]: value });
          break;
        case 'videos':
          rowDataDTO = plainToClass(PickType(NavigationCreateVariantDto, ['videos']), { [key]: value });
          break;
        case 'attributes':
          rowDataDTO = plainToClass(PickType(NavigationCreateVariantDto, ['attributes']), { [key]: value });
          break;
        case 'price':
          rowDataDTO = plainToClass(PickType(NavigationCreateVariantDto, ['price']), { [key]: value });
          break;
        case 'listPrice':
          rowDataDTO = plainToClass(PickType(NavigationCreateVariantDto, ['listPrice']), { [key]: value });
          break;
        case 'stock':
          rowDataDTO = plainToClass(PickType(NavigationCreateVariantDto, ['stock']), { [key]: value });
          break;
        default:
          break;
      }

      // if (rowDataDTO) {
      const validationErrors = await validate(rowDataDTO);

      // console.log(key, value, address);
      dataSection[key] = value;
      if (validationErrors.length > 0) {
        errors.push({
          address,
          value,
          error: Object.values(validationErrors[0].constraints).join(', '),
        });
      }
    }

    data.push(dataSection);
  }

  return { data, errors };
};

// ! //////
export interface SheetData {
  name: string;
  header: string[];
  content: { [key: string]: CellValue }[];
  cellsToColor?: { address: string; color?: string }[];
}

export interface CreateExcelProps {
  sheets: SheetData[];
  res: Response;
}

export const createExcel = async ({ sheets, res }: CreateExcelProps) => {
  try {
    const workbook = new Workbook();

    sheets.forEach((sheet) => {
      const worksheet = workbook.addWorksheet(sheet.name);

      // Map headers to their positions
      // const headerPositions = sheet.header.reduce(
      //   (acc, header, index) => {
      //     acc[header] = index;
      //     return acc;
      //   },
      //   {} as { [key: string]: number },
      // );

      worksheet.columns = sheet.header.map((header) => ({ header, key: header }));

      // Organize content based on header positions
      // const organizedContent = sheet.content.map((row) => {
      //   const orderedRow: CellValue[] = Array(sheet.header.length).fill(null);
      //   for (const key in row) {
      //     if (headerPositions.hasOwnProperty(key)) {
      //       orderedRow[headerPositions[key]] = row[key];
      //     }
      //   }
      //   return orderedRow;
      // });

      const organizedContent = sheet.content.map((row) => {
        const orderedRow: CellValue[] = [];
        sheet.header.forEach((key) => {
          orderedRow.push(row[key] ?? '');
        });
        return orderedRow;
      });

      worksheet.addRows(organizedContent);

      // Colorear celdas específicas si se proporciona la información
      if (sheet.cellsToColor && sheet.cellsToColor.length > 0) {
        sheet.cellsToColor.forEach((cellInfo) => {
          const { address, color } = cellInfo;
          const newColor = color ? color : 'FFFF0000';
          const cell = worksheet.getCell(address);

          // Aplicar formato de relleno
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: newColor }, // Color en formato ARGB (Alpha, Red, Green, Blue)
          };
        });
      }
    });

    // Configurar las cabeceras de respuesta para descargar el archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=output_with_errors.xlsx');

    // Escribir el libro de Excel en la respuesta HTTP
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error in createExcel function:', error); // Log detailed error
    throw new Error('Failed to create Excel file');
  }
};

// ! /////////////////////////////////////

interface ExcelFile {
  buffer: Buffer; // Tipo específico para el archivo Excel, podría ajustarse según el uso
}
export const readExcelFile = async ({ file }: { file: ExcelFile }): Promise<ContentReturn> => {
  try {
    // Cargar el archivo Excel usando ExcelJS
    const workbook = new Workbook();
    await workbook.xlsx.load(file.buffer); // Assumimos que `file` tiene una propiedad `buffer` que es un Buffer

    let resultData: ValidateValueProps[] = [];
    let rowTitle: string[] = [];

    // Iterar sobre cada hoja del workbook
    workbook.eachSheet(async (worksheet) => {
      const sheetData: ValidateValueProps[] = [];

      // Iterar sobre cada fila de la hoja
      worksheet.eachRow(async (row, rowNumber) => {
        const rowData: ValidateValueProps = {};
        // Crear un objeto con los valores de cada celda en la fila actual
        if (rowNumber === 1) {
          rowTitle = title({ row }); // Asumiendo que `title` devuelve un array de strings
        } else {
          row.eachCell(async (cell, colNumber) => {
            const key = rowTitle[colNumber];
            const address = cell.address;
            const value = cell.value;
            // const { value, error } = await validateValue({ key, value: valueInitial, cellAddress: cell.address });
            // if (error) {
            // resultData.errors.push(error);
            // } else {
            rowData[key] = { value, address };
            // }
          });

          sheetData.push(rowData);
        }
      });

      resultData = sheetData;
    });

    const organizedContent = resultData.reduce((acc, row) => {
      const orderedRow: ValidateValueProps = {};
      const rowNumber = Object.values(row)[0]?.address?.replace(/[^0-9]/g, '');
      rowTitle.forEach((key, index) => {
        orderedRow[key] = row[key] ?? { value: '', address: `${indexToLetter(index - 1)}${rowNumber}` };
        // orderedRow.push(row[key] ?? '');
      });
      return [...acc, orderedRow];
    }, []);

    // console.log(organizedContent);

    // Responder con los datos del archivo Excel y los errores recolectados
    const resultValidate = await validateValue(organizedContent);

    return resultValidate;
  } catch (error) {
    throw error;
  }
};
