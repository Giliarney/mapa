import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';

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

  const { data: dadosResponse, isLoading, error } = useQuery<Dados[]>({
    queryKey: ["get-dados", currentPage, selectedOrigin],
    queryFn: async () => {
      const response = await fetch(`https://api-mapa.vercel.app/dados?_page=${currentPage}&_limit=15&UF%20Origem=${selectedOrigin}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      await new Promise( resolve => setTimeout(resolve, 100))

      return data;
    },
    placeholderData: keepPreviousData,

  });

  console.log(dadosResponse);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <BeatLoader color="#36d7b7" size={30} />
        <span>Carregando...</span>
    </div>
  );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const data = dadosResponse || [];

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
                {
                    data.length > 0 ? (
                        data.map((item, index) => (
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
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">Nenhum dado encontrado</TableCell>
                        </TableRow>
                    )
               }
            </TableBody>
            </Table>
        </div>

        <div className="w-full flex items-center justify-center rounded py-4 px-2 bg-slate-200">
            <div>
                <Pagination className="w-fit bg-slate-500">
                    <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                        href="#"
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        className={currentPage === 1 ? "disabled" : ""}
                        aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            className={currentPage ? "active" : ""}
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                        href="#"
                        onClick={() => data.length > 0 ? handlePageChange(currentPage + 1) : ''}
                        />
                    </PaginationItem>

                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    </div>
  );
}

export default TableInfos;
