import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Dispatch, SetStateAction } from "react";

export function GetPages({ allPage, page }: { allPage: number, page: number }) {
  const list: number[] = [];
  if (allPage > 3) {
    for (let index = page <= 3 ? 2 : page - 2; index < (page < allPage - 3 ? page + 3 : allPage); index++) {
      list.push(index);
    }
  } else {
    if (allPage >= 2) {
      for (let index = 2; index < allPage; index++) {
        list.push(index);
      }
    }
  }
  return list;
}

export default function Pages({page, allPage, setPage}:{page:number, allPage:number, setPage:Dispatch<SetStateAction<number>>}) {
  return <Pagination className="p-1">
    <PaginationContent>
      <PaginationItem>
        <PaginationLink isActive={page === 1} role='button' onClick={() => setPage(1)}>{1}</PaginationLink>
      </PaginationItem>
      {page > 4 && <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>}
      {GetPages({ allPage, page }).map(i =>
        <PaginationItem>
          <PaginationLink isActive={page === i} role='button' onClick={() => setPage(i)}>{i}</PaginationLink>
        </PaginationItem>
      )}
      {page < allPage - 3 && <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>}
      <PaginationItem>
        <PaginationLink isActive={page === allPage} role='button' onClick={() => setPage(allPage)}>{allPage}</PaginationLink>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
}