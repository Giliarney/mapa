import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { Search, FileSpreadsheet, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


export interface responseDados {
  first: number;
  prev: number | null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: ICMSDados[];
}

export interface Products {
  "ID": string;
  "Produto": string;
  "ImagemURL": string;
}

export interface ICMSDados {
  "Produto": string;
  "NCM": string;
  "Origem": string;
  "Destino": string;
  "UF Origem": string;
  "UF Destino": string;
  "Pagamento ICMS": number;
  "Pagamento PIS/COFINS": number;
}

function Cards() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null); // Total de páginas
  const [totalItems, setTotalItems] = useState<number | null>(null); // Total de itens
  const [searchParams] = useSearchParams();
  const selectedOrigin = searchParams.get("origin");
  const selectedDestination = searchParams.get("destination");
  const apiProductsSheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_API_URL_SHEET_ID_URL}/values/produtos?key=${import.meta.env.VITE_API_URL_KEY}`
  const apiIcmsSheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_API_URL_SHEET_ID_URL}/values/dados?key=${import.meta.env.VITE_API_URL_KEY}`

  // Carrega a página atual usando `useQuery`
  const { data: dadosResponse, isLoading, error } = useQuery<ICMSDados[]>({
    queryKey: ["get-dados", currentPage, selectedOrigin],
    queryFn: async () => {
      const response = await fetch(apiIcmsSheetURL);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const dadosFormatados: ICMSDados[] = data.values.map((linha: string[]) => ({
        Produto: linha[0],
        NCM: linha[1],
        Origem: linha[2],
        Destino: linha[3],
        "UF Origem": linha[4],
        "UF Destino": linha[5],
        "Pagamento ICMS": linha[6],
        "Pagamento PIS/COFINS": linha[7]
      }));

      await new Promise(resolve => setTimeout(resolve, 500));

      return dadosFormatados;
    },
    placeholderData: keepPreviousData,
  });

  const { data: dadosProducts } = useQuery<Products[]>({
    queryKey: ["get-data-products"],
    queryFn: async () => {
      const response = await fetch(apiProductsSheetURL);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const dadosFormatados: Products[] = data.values?.map((linha: string) => ({
        "ID": linha[0] || "",
        "Produto": linha[1] || "",
        "ImagemURL": linha[2] || "",
      })) || [];

      await new Promise(resolve => setTimeout(resolve, 3000));

      return dadosFormatados;
    },
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

  // Combine os dados usando o nome do produto como chave
  const combinedData = dadosResponse?.map((dado) => {
    const produtoInfo = dadosProducts?.find((prod) => prod.Produto?.toLowerCase() == dado.Produto?.toLowerCase());
    return {
      ...dado,
      ImagemURL: produtoInfo?.ImagemURL || "",
      ID: produtoInfo?.ID || "",
    };
  }) || [];

  const data = selectedOrigin && selectedDestination ? combinedData?.filter((dado) => {
    return dado["UF Origem"] == selectedOrigin && dado["UF Destino"] == selectedDestination;
  }) : combinedData || [];

  // Capturar o total de itens (ou páginas) da resposta
  const totalItemsHeader = data?.length;

  if (totalItemsHeader && !totalItems) {
    const total = Number(totalItemsHeader);
    setTotalItems(total);
    // Calcular e definir o número total de páginas
    const pages = Math.ceil(total / 6);
    setTotalPages(pages);
  }


  const uniqueData = data.filter((value, index, self) =>
    index === self.findIndex((t) =>
      t.Produto == value.Produto && t["Origem"] == value["Origem"] && t["Destino"] == value["Destino"]
    )
  );

  // Função para filtrar valores exclusivos de uma lista
  const getUniqueValues = (field: keyof ICMSDados) => {
    return uniqueData
      .map(item => item[field])
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  const originOptions = getUniqueValues("Origem");
  const destinationOptions = getUniqueValues("Destino");
  const productOptions = getUniqueValues("Produto");

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleNextPage = () => {
    if (totalPages && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full flex flex-wrap gap-5 justify-between bg-[#f0f0f0] p-4">
      <header className="w-full flex gap-2 py-4">

        <div>
          <h1>Layout</h1>
          <div className="p-2 hover:bg-slate-300 w-fit rounded-[6px]">
          <FileSpreadsheet className="hover:cursor-pointer"></FileSpreadsheet>

          </div>

          <div className="p-2 hover:bg-slate-300 w-fit rounded-[6px]">
          <LayoutGrid className="hover:cursor-pointer"></LayoutGrid>

          </div>
        </div>

        <div className='w-full flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4'>
          <Select>
            <SelectTrigger className=" rounded text-slate-700 border-slate-300">
              <SelectValue placeholder="Produto" />
            </SelectTrigger>

            <SelectContent className='rounded bg-white'>
              <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="todos-produtos">Todos</SelectItem>
              {productOptions.map((produto, index) => (
                <SelectItem key={index} className='rounded hover:bg-slate-700 hover:text-white transition-all' value={String(produto)}>{produto}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className=" rounded border-slate-300 text-slate-700">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>

            <SelectContent className='bg-white text-slate-700 rounded'>
              <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="todas-origens">Todos</SelectItem>
              {originOptions.map((origem, index) => (
                <SelectItem key={index} className='rounded hover:bg-slate-700 hover:text-white transition-all' value={String(origem)}>{origem}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className=" rounded border-slate-300 text-slate-700">
              <SelectValue placeholder="Destino" />
            </SelectTrigger>

            <SelectContent className='bg-white text-slate-700 rounded'>
              <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="todos-destinos">Todos</SelectItem>
              {destinationOptions.map((destino, index) => (
                <SelectItem key={index} className='rounded hover:bg-slate-700 hover:text-white transition-all' value={String(destino)}>{destino}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/*<div className='w-full relative flex items-center'>
            <Search className='absolute right-3 text-slate-500'></Search>
            <Input placeholder='Buscar' className='rounded border-slate-300 text-slate-700'></Input>
          </div>*/}
        </div>
      </header>

      {
        data ? (
          data.slice(startIndex, endIndex).map((item, index) => (
            <div key={index} className="flex items-center p-4 justify-between bg-[#ffffff] border border-[#e4e4e4]
             rounded-xl text-white text-xs min-w-[595px] min-h-[211px] gap-4">

              <div className="min-w-[200px] min-h-[180px] bg-slate-100 relative rounded-xl"
                style={{ backgroundImage: `url(${item.ImagemURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="flex items-center justify-center py-1 px-2 gap-1 left-2 top-2 rounded-[5px]
                 absolute bg-[#FFFFFF] font-semibold text-xs text-[#463C3C]"
                >
                  <h1>NCM</h1>
                  <p className="">{item.NCM}</p>
                </div>
              </div>


              <div className="flex flex-col justify-between w-full h-full bg-[#ffffff] relative">
                <div className="w-fit text-xl border-b border-[#e4e4e4]">
                  <h1 className="text-[#463C3C]">{item.Produto}</h1>
                </div>

                <div className="w-full text-base ">
                  <div className="flex gap-1">
                    <h1 className="text-[#463C3C] font-bold">Origem:</h1>
                    <p className="text-[#7a7a7a]">{item.Origem}</p>
                  </div>

                  <div className="flex gap-1">
                    <h1 className="text-[#463C3C]">Destino:</h1>
                    <p className="text-[#7a7a7a]">{item.Destino}</p>
                  </div>

                  <div className="flex gap-1">
                    <h1 className="text-[#463C3C]">Estado Origem:</h1>
                    <p className="text-[#7a7a7a]">{item["UF Origem"]}</p>
                  </div>

                  <div className="flex gap-1">
                    <h1 className="text-[#463C3C]">Estado Destino:</h1>
                    <p className="text-[#7a7a7a]">{item["UF Destino"]}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-2 text-base text-white">
                  <div className="bg-[#343434] p-1 flex items-center justify-center rounded-xl gap-1 w-full border border-[#e4e4e4] ">
                    <h1>PIS/COFINS -</h1>
                    <p>{item["Pagamento PIS/COFINS"]}</p>
                  </div>

                  <div className="flex items-center justify-center rounded-xl gap-1 w-full bg-emerald-600  border border-[#e4e4e4] ">
                    <h1>ICMS -</h1>
                    <p>{item["Pagamento ICMS"]}</p>
                  </div>
                </div>

                <div className="flex absolute right-0 top-0 text-lg gap-1 text-[#463C3C]">
                  <h1 className="hidden">ID</h1>
                  <p>#{item.ID}</p>
                </div>
              </div>

            </div>
          ))) : (
          <div>
            <div className="text-center">Nenhum dado encontrado</div>
          </div>
        )
      }

      <div className="w-full sm:flex-row flex-col h-full flex items-center justify-between rounded py-3 bg-slate-700 text-white">
        <div className="flex p-4 items-center w-full justify-between text-xs sm:text-sm">
          <span>Páginas: <span className="text-white">{totalPages ?? "Carregando..."}</span></span>
          <span>Total de Itens: <span className="text-white">{totalItems ?? "Carregando..."}</span></span>
        </div>

        <div className="h-full w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePreviousPage}
                  className={currentPage === 1 ? "disabled" : ""}
                  aria-disabled={currentPage === 1}
                >
                  Anterior
                </PaginationPrevious>
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
                  onClick={handleNextPage}
                  className={(!totalPages || currentPage >= totalPages) ? "disabled" : ""}
                  aria-disabled={(!totalPages || currentPage >= totalPages)}
                >
                  Próxima
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Cards;
