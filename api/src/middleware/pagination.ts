import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    if (!req.query.per_page || !req.query.page_number) {
      return next();
    }

    const perPageStr = req.query.per_page?.toString();
    const pageNumberStr = req.query.page_number?.toString();

    const per_page = parseInt(perPageStr, 10);
    const page_number = parseInt(pageNumberStr, 10);

    const parsedQuery = {
      per_page,
      page_number,
    };

    const originalSend: <T>(body: T) => Response = res.send;

    res.send = function (body) {
      const parsedBody = JSON.parse(body);

      const paginationInfo = calculatePaginationInfo(
        parsedQuery,
        parsedBody.count,
      );

      res.links(paginationInfo);

      if (parsedBody.hasOwnProperty('count')) {
        delete parsedBody.count;
      }

      const modifiedBody = JSON.stringify(parsedBody);
      return originalSend.call(this, modifiedBody);
    };

    return next();
  }
}

const calculatePaginationInfo = (
  query: { per_page: number; page_number: number },
  count: number,
) => {
  const per_page = query.per_page || 10;
  const page_number = query.page_number || 0;

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
