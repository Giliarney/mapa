import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FileSpreadsheet, LayoutGrid, ChevronFirst, ChevronLast } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}


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
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectDestination, setSelectedDestination] = useState<string | null>(null);


  // Carrega a página atual usando `useQuery`
  const { data: dadosResponse, isLoading, error } = useQuery<ICMSDados[]>({
    queryKey: ["get-dados", currentPage, selectedOrigin],
    queryFn: async () => {
      const response = await fetch(apiIcmsSheetURL);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const dadosFormatados: ICMSDados[] = data.values?.map((linha: string[]) => ({
        Produto: linha[0] || "",
        NCM: linha[1] || "",
        Origem: linha[2] || "",
        Destino: linha[3] || "",
        "UF Origem": linha[4] || "",
        "UF Destino": linha[5] || "",
        "Pagamento ICMS": linha[6] || 0,
        "Pagamento PIS/COFINS": linha[7] || 0,
      })) || [];

      await new Promise(resolve => setTimeout(resolve, 3000));

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

      await new Promise(resolve => setTimeout(resolve, 1500));

      return dadosFormatados;
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className=" flex flex-wrap gap-5 w-full items-center justify-center">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Skeleton key={index} className="w-[595px] h-[211px] bg-[#3b3b3b25] animate-pulse rounded-xl" />
          ))}
        </Skeleton >
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

  const filteredData = data?.filter((item) => {
    const matchesProduct = selectedProduct ? item.Produto.toLowerCase() === selectedProduct.toLowerCase() : true;
    const matchesOrigin = selectOrigin ? item.Origem.toLowerCase() === selectOrigin.toLowerCase() : true;
    const matchesDestination = selectDestination ? item.Destino.toLowerCase() === selectDestination.toLowerCase() : true;

    return matchesProduct && matchesOrigin && matchesDestination;
  }) || [];

  // Capturar o total de itens (ou páginas) da resposta
  const totalItemsHeader = filteredData.length;
  if (totalItemsHeader !== totalItems) {
    setTotalItems(totalItemsHeader);
    setTotalPages(Math.ceil(totalItemsHeader / itemsPerPage));
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

  const handleNextPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Previne o comportamento padrão
    if (currentPage < (totalPages || 1)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Previne o comportamento padrão
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleFirstPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Vai para a primeira página
  };

  const handleLastPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (totalPages) {
      setCurrentPage(totalPages); // Vai para a última página
    }
  };


  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-between bg-[#ebebeb] p-4 border-2">
      <header className="w-full flex gap-2 items-center justify-center">
        <div className='w-full flex flex-col items-center justify-between gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4'>
          <Select onValueChange={(value) => setSelectedProduct(value === "todos-produtos" ? null : value)}>
            <SelectTrigger className="rounded text-white bg-[#282828] ">
              <SelectValue placeholder="Produto" />
            </SelectTrigger>
            <SelectContent className="rounded bg-white text-[#282828]">
              <SelectItem value="todos-produtos">Todos</SelectItem>
              {productOptions.map((produto, index) => (
                <SelectItem key={index} value={String(produto)}>{produto}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedOrigin(value === "todas-origens" ? null : value)}>
            <SelectTrigger className="rounded text-white bg-[#282828]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent className="rounded bg-white text-[#282828]">
              <SelectItem value="todas-origens">Todos</SelectItem>
              {originOptions.map((origem, index) => (
                <SelectItem key={index} value={String(origem)}>{origem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedDestination(value === "todos-destinos" ? null : value)}>
            <SelectTrigger className="rounded text-white bg-[#282828]">
              <SelectValue placeholder="Destino" />
            </SelectTrigger>
            <SelectContent className="rounded bg-white text-[#282828]">
              <SelectItem value="todos-destinos">Todos</SelectItem>
              {destinationOptions.map((destino, index) => (
                <SelectItem key={index} value={String(destino)}>{destino}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/*<div className='w-full relative flex items-center'>
            <Search className='absolute right-3 text-slate-500'></Search>
            <Input placeholder='Buscar' className='rounded bg-[#282828]  text-slate-700'></Input>
          </div>*/}
        </div>

        <div className="w-fit flex">
          <div className="p-2 hover:bg-[#3b3b3b25] text-[#282828] w-fit rounded-[6px] hover:cursor-pointer transition-all">
            <FileSpreadsheet ></FileSpreadsheet>
          </div>

          <div className="p-2 hover:bg-[#3b3b3b25] text-[#282828] w-fit rounded-[6px] hover:cursor-pointer transition-all">
            <LayoutGrid></LayoutGrid>
          </div>
        </div>
      </header>

      <section className="w-full h-[700px] grid grid-cols-2 grid-rows-3 gap-4 border border-[#3b3b3b25] p-4 rounded-xl bg-[#3b3b3b10]">
        {
          filteredData ? (
            filteredData.slice(startIndex, endIndex).map((item, index) => (
              <div key={index} className="flex items-center p-4 justify-between bg-[#ffffff] border border-[#e4e4e4]
             rounded-xl text-white text-xs min-w-[580px] min-h-[211px] gap-4">

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
            <div className="w-full h-full">
              <div className="text-center">Nenhum dado encontrado</div>
            </div>
          )
        }
      </section>

      <div className="w-full min-h-[36px] flex items-center justify-between rounded p-2 bg-[#1d1d1d] text-white relative">
        <div className="flex p-4 items-center justify-between w-fit text-xs sm:text-sm gap-4">
          <div className="flex gap-2 ">
            <h1 className="w-full flex font-semibold">Páginas: </h1>
            <span className="text-white font-normal">{totalPages ?? "Carregando..."}</span>
          </div>

          <div className="flex gap-2">
            <h1 className="w-full flex  font-semibold">Total de Itens:</h1>
            <span className="text-white font-normal">{totalItems ?? "Carregando..."}</span>
          </div>
        </div>

        <TooltipProvider>
          <Pagination className="w-fit absolute right-8 flex">
            <PaginationContent >
              <Tooltip>
                <TooltipTrigger asChild >
                  <PaginationItem

                  >
                    <a className={`${currentPage === 1 ? "text-gray-400 cursor-not-allowed p-3" :
                      "flex items-center justify-center hover:bg-[#282828] hover:border-[#3f3f3f] hover:rounded-xl p-3 hover:cursor-pointer"
                      }`}
                      onClick={handleFirstPage}>
                      <ChevronFirst className="w-4 h-4"
                      ></ChevronFirst>
                    </a>

                  </PaginationItem>
                </TooltipTrigger>
                <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Primeira Página</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild >
                  <PaginationItem
                    className={`${currentPage === 1 ? "text-gray-400 cursor-not-allowed" :
                      "flex items-center justify-center hover:bg-[#282828] hover:border-[#3f3f3f] hover:rounded-xl"
                      }`}
                  >
                    <PaginationPrevious
                      href="#"
                      onClick={handlePreviousPage}
                      className={currentPage === 1 ? "disabled" : ""}
                      aria-disabled={currentPage === 1}
                    >
                      Anterior
                    </PaginationPrevious>
                  </PaginationItem>
                </TooltipTrigger>
                <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Página Anterior</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild >
                  <PaginationItem className="bg-[#282828] border-[#3f3f3f] rounded-xl">
                    <PaginationLink
                      href="#"
                      className={currentPage ? "active" : ""}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                </TooltipTrigger>
                <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Página Atual</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild >
                  <PaginationItem
                    className={`${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" :
                      "flex items-center justify-center hover:bg-[#282828] hover:border-[#3f3f3f] hover:rounded-xl"
                      }`}>
                    <PaginationNext
                      href="#"
                      onClick={handleNextPage}
                    >
                      Próxima
                    </PaginationNext>
                  </PaginationItem>
                </TooltipTrigger>
                <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Página Inicial</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild >
                  <PaginationItem

                  >
                    <a className={`${currentPage === totalPages ? "text-gray-400 cursor-not-allowed p-3" :
                      "flex items-center justify-center hover:bg-[#282828] hover:border-[#3f3f3f] hover:rounded-xl hover:cursor-pointer p-3"
                      }`}
                      onClick={currentPage === totalPages ? undefined : handleLastPage}>
                      <ChevronLast className="w-4 h-4"></ChevronLast>
                    </a>
                  </PaginationItem>
                </TooltipTrigger>
                <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Última Página</TooltipContent>
              </Tooltip>
            </PaginationContent>
          </Pagination>
        </TooltipProvider>
      </div >
    </div >
  );
}

export default Cards;
