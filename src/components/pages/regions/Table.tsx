import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"; 

export interface responseDados {
  first: number;
  prev: number | null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Dados[];
}

export interface Dados {
  Produto: string;
  NCM: string;
  Origem: string;
  Destino: string;
  "UF Origem": string;
  "UF Destino": string;
  "Pagamento ICMS": number;
  "Pagamento PIS/COFINS": number;
  id: string;
}

function TableInfos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const selectedOrigin = searchParams.get("origin");

  const { data: dadosReponse, isLoading } = useQuery<responseDados>({
    queryKey: ["get-dados", currentPage, selectedOrigin],
    queryFn: async () => {
      const response = await fetch(`https://api-mapa.vercel.app/dados?_page=${currentPage}&UF%20Origem=${selectedOrigin}`);
      const data = await response.json();
      return data;
    },
  });

  if (isLoading) {
    return null;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full flex flex-col items-center px-4">
        <div className="w-full">
            <Table className="w-full">
            <TableHeader>
                <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>NCM</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>UF Origem</TableHead>
                <TableHead>UF Destino</TableHead>
                <TableHead>ICMS</TableHead>
                <TableHead>PIS/COFINS</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {dadosReponse?.data.map((item, index) => (
                <TableRow key={index} className="hover:bg-slate-200">
                    <TableCell>{item.Produto}</TableCell>
                    <TableCell>{item.NCM}</TableCell>
                    <TableCell>{item.Origem}</TableCell>
                    <TableCell>{item.Destino}</TableCell>
                    <TableCell>{item["UF Origem"]}</TableCell>
                    <TableCell>{item["UF Destino"]}</TableCell>
                    <TableCell>{item["Pagamento ICMS"]}</TableCell>
                    <TableCell>{item["Pagamento PIS/COFINS"]}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        <div className="w-full flex items-center justify-between rounded py-4 px-2 bg-slate-200">
            <div className="flex items-center justify-between w-64">
                <div className="flex items-center">
                    <span>Páginas: {dadosReponse?.pages}</span>
                </div>

                <div className="flex items-center">
                    <span>Total de Items: {dadosReponse?.items}</span>
                </div>
            </div>

            <div>
                {dadosReponse && (
                <Pagination className="w-fit bg-slate-500">
                    <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                        href="#"
                        onClick={() => handlePageChange(dadosReponse.prev || 1)}
                        className={currentPage === 1 ? "disabled" : ""}
                        aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>

                    <PaginationItem >
                        <PaginationLink
                            href="#"
                            className={currentPage + 1 === currentPage ? "active" : ""}
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                        href="#"
                        onClick={() => handlePageChange(dadosReponse.next || dadosReponse.last)}
                        className={currentPage === dadosReponse.pages ? "disabled" : ""}
                        aria-disabled={currentPage === dadosReponse.pages}
                        />
                    </PaginationItem>

                    </PaginationContent>
                </Pagination>
                )}
            </div>
        </div>
    </div>
  );
}

export default TableInfos;
