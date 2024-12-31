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
  const apiSheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1FWcCvbLcX48JUuPZ_j_C03b-WDsyBe67ZXymuXvlXGw/values/teste!A2:H10000?key=AIzaSyBs0S3D-xxLwIvBFvPkb5wF0-9KQxwiI0g"

  // Função para carregar a página e capturar o número total de páginas e itens
  {/*const loadPage = async (page: number) => {
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
  };*/}

  // Carrega a página atual usando `useQuery`
  const { data: dadosResponse, isLoading, error } = useQuery<Dados[]>({
    queryKey: ["get-dados", currentPage, selectedOrigin],
    queryFn: async () => {
      const response = await fetch(apiSheetURL);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const dadosFormatados: Dados[] = data.values.map((linha: string[]) => ({
        Produto: linha[0],
        NCM: linha[1],
        Origem: linha[2],
        Destino: linha[3],
        "UF Origem": linha[4],
        "UF Destino": linha[5],
        "Pagamento ICMS": parseFloat(linha[6].replace(",", ".")),
        "Pagamento PIS/COFINS": parseFloat(linha[7].replace(",", "."))
      }));

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

      return dadosFormatados;
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

  const data = selectedOrigin && selectedDestination ? dadosResponse?.filter((dado) => {
    return dado["UF Origem"] === selectedOrigin && dado["UF Destino"] === selectedDestination;
  }): dadosResponse || [];


  {/*const handlePageChange = async (page: number) => {
    if (page > 0 && (!totalPages || page <= totalPages)) {
      await loadPage(page);
    }
  };*/}

  return (
    <div className="flex flex-col items-center">
            <Table >
            <TableHeader className="bg-slate-700 text-white rounded-md text-xs sm:text-sm">
                <TableRow>
                <TableHead className='min-w-44 text-start'>Produto</TableHead>
                <TableHead className='min-w-44'>NCM</TableHead>
                <TableHead className='min-w-44 text-start'>Origem</TableHead>
                <TableHead className='min-w-32 text-start'>Destino</TableHead>
                <TableHead className='min-w-32'>UF Origem</TableHead>
                <TableHead className='min-w-32'>UF Destino</TableHead>
                <TableHead className='min-w-32'>ICMS</TableHead>
                <TableHead className='min-w-32'>PIS/COFINS</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="bg-slate-50">
                {
                    data? (
                        data?.map((item, index) => (
                            <TableRow key={index} className="hover:bg-slate-700 hover:text-white text-xs sm:text-sm">
                                <TableCell>{item.Produto}</TableCell>
                                <TableCell className="text-center">{item.NCM}</TableCell>
                                <TableCell>{item.Origem}</TableCell>
                                <TableCell>{item.Destino}</TableCell>
                                <TableCell className="text-center">{item["UF Origem"]}</TableCell>
                                <TableCell className="text-center">{item["UF Destino"]}</TableCell>
                                <TableCell className="text-center">{item["Pagamento ICMS"]} %</TableCell>
                                <TableCell className="text-center">{item["Pagamento PIS/COFINS"]} %</TableCell>
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


        <div className="w-full sm:flex-row flex-col h-full flex items-center justify-between rounded py-3 bg-slate-700 text-white">
            <div className="flex p-4 items-center w-full justify-between text-xs sm:text-sm">
              <span>Páginas: <span className="text-white">{totalPages ?? 'Carregando...'}</span></span>
              <span>Total de Itens: <span className="text-white">{totalItems ?? 'Carregando...'}</span></span>
            </div>

            <div className="h-full w-full">
                <Pagination>
                    <PaginationContent>

                    <PaginationItem className="hover:bg-white hover:text-slate-700 rounded-[10px] transition-all text-xs sm:text-sm">
                        <PaginationPrevious
                        href="#"
                        className={currentPage === 1 ? "disabled" : ""}
                        aria-disabled={currentPage === 1}
                        onClick={() => currentPage === 1 ? "" : setCurrentPage(-1)}
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

                    <PaginationItem className="hover:bg-white hover:text-slate-700 rounded-[10px] transition-all text-xs sm:text-sm"> 
                        <PaginationNext
                        href="#"
                        className={(!totalPages || currentPage >= totalPages) ? "disabled" : ""}
                        aria-disabled={(!totalPages || currentPage >= totalPages)}
                        onClick={() => setCurrentPage(+1)}
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
