import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { PER_PAGE, PAGE_NUMBER } from '../utils';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const per_page = req.query.per_page ?? PER_PAGE.toString();
    const page_number = req.query.page_number ?? PAGE_NUMBER.toString();
    const parsedQuery = {
      per_page: parseInt(per_page as string, 10),
      page_number: parseInt(page_number as string, 10),
    };

    const originalSend: (body: string) => Response = res.send;

    res.send = function (body) {
      const parsedBody = JSON.parse(body);
      if (!('count' in parsedBody)) {
        return originalSend.call(this, body);
      }

      res.links(calculatePaginationInfo(parsedQuery, parsedBody.count));
      delete parsedBody.count;

      return originalSend.call(this, JSON.stringify(parsedBody));
    };

    // eslint-disable-next-line
    return next();
  }
}

const calculatePaginationInfo = (
  { per_page, page_number }: { per_page: number; page_number: number },
  count: number,
) => {
  const last_page = Math.floor((count > 0 ? count - 1 : 0) / per_page);
  const current_page = page_number > last_page ? last_page : page_number;
  const prev_page = current_page > 0 ? current_page - 1 : 0;
  const next_page = current_page < last_page - 1 ? current_page + 1 : last_page;

  const paginationInfo = {
    curr: current_page,
    prev: prev_page,
    next: next_page,
    last: last_page,
    total: count,
  };

  return paginationInfo;
};
