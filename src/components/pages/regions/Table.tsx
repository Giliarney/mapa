import { useState} from "react";
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
  const [totalPages, setTotalPages] = useState<number | null>(null); // Total de páginas
  const [totalItems, setTotalItems] = useState<number | null>(null); // Total de itens
  const [searchParams] = useSearchParams();
  const selectedOrigin = searchParams.get("origin");
  const selectedDestination = searchParams.get("destination");

  // Função para carregar a página e capturar o número total de páginas e itens
  const loadPage = async (page: number) => {
    const response = await fetch(`https://api-mapa.vercel.app/dados?_page=${page}&_limit=15&UF%20Origem=${selectedOrigin}&UF%20Destino=${selectedDestination}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Capturar o número total de itens a partir do cabeçalho, se disponível
    const totalItemsHeader = response.headers.get("X-Total-Count"); // Exemplo de cabeçalho
    if (totalItemsHeader) {
      const total = Number(totalItemsHeader);
      setTotalItems(total);

      // Calcular o número total de páginas
      const pages = Math.ceil(total / 15); // Assumindo 15 itens por página
      setTotalPages(pages);
    }

    // Se houver dados, permitir a navegação, caso contrário, bloquear
    if (data.length > 0) {
      setCurrentPage(page);
    }
  };

  // Carrega a página atual usando `useQuery`
  const { data: dadosResponse, isLoading, error } = useQuery<Dados[]>({
    queryKey: ["get-dados", currentPage, selectedOrigin],
    queryFn: async () => {
      const response = await fetch(`https://api-mapa.vercel.app/dados?_page=${currentPage}&_limit=15&UF%20Origem=${selectedOrigin}&UF%20Destino=${selectedDestination}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Capturar o total de itens (ou páginas) da resposta
      const totalItemsHeader = response.headers.get("X-Total-Count");

      if (totalItemsHeader && !totalItems) {
        const total = Number(totalItemsHeader);
        setTotalItems(total);

        // Calcular e definir o número total de páginas
        const pages = Math.ceil(total / 15);
        setTotalPages(pages);
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      return data;
    },
    placeholderData: keepPreviousData,
  });

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

  const handlePageChange = async (page: number) => {
    if (page > 0 && (!totalPages || page <= totalPages)) {
      await loadPage(page);
    }
  };

  return (
    <div className="sm:w-full h-fit  w-screen flex flex-col items-center">
        <div className="w-screen">
            <Table className="">
            <TableHeader className="bg-slate-600 text-white rounded-[10px]">
                <TableRow className="px-8">
                <TableHead className="">Produto</TableHead>
                <TableHead>NCM</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>UF Origem</TableHead>
                <TableHead>UF Destino</TableHead>
                <TableHead>ICMS</TableHead>
                <TableHead>PIS/COFINS</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="bg-slate-300">
                {
                    data.length > 0 ? (
                        data.map((item, index) => (
                            <TableRow key={index} className="hover:bg-slate-600 hover:text-white text-center">
                                <TableCell>{item.Produto}</TableCell>
                                <TableCell>{item.NCM}</TableCell>
                                <TableCell>{item.Origem}</TableCell>
                                <TableCell>{item.Destino}</TableCell>
                                <TableCell>{item["UF Origem"]}</TableCell>
                                <TableCell>{item["UF Destino"]}</TableCell>
                                <TableCell>{item["Pagamento ICMS"]} %</TableCell>
                                <TableCell>{item["Pagamento PIS/COFINS"]} %</TableCell>
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

        <div className="w-screen h-full flex items-center justify-between rounded px-12 py-3 bg-slate-600 text-white">
            <div className="flex items-center justify-between w-64">
                <div className="flex items-center">
                    <span>Páginas: {totalPages ?? 'Carregando...'}</span>
                </div>
                <div className="flex items-center">
                    <span>Total de Itens: {totalItems ?? 'Carregando...'}</span>
                </div>
            </div>

            <div>
                <Pagination className="w-fit">
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={(!totalPages || currentPage >= totalPages) ? "disabled" : ""}
                        aria-disabled={(!totalPages || currentPage >= totalPages)}
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
