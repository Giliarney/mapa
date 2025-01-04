import { useState, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FileSpreadsheet, LayoutGrid, ChevronFirst, ChevronLast } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const itemsPerPageCards = 6;
  const itemsPerPageTable = 15;
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
  const [selectView, setSelectedView] = useState<string | null>('cards');
  const [filterChanged, setFilterChanged] = useState(false);


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

      await new Promise(resolve => setTimeout(resolve, 2000));

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

      await new Promise(resolve => setTimeout(resolve, 500));

      return dadosFormatados;
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className=" flex flex-wrap gap-5 w-full items-center justify-center">
          {Array.from({ length: itemsPerPageCards }).map((_, index) => (
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
  useEffect(() => {
    // Redefina a página inicial apenas quando os filtros mudarem
    if (filterChanged) {
      setCurrentPage(1);
      setFilterChanged(false); // Resete o estado de mudança de filtro
    }
  
    const totalItemsHeader = filteredData.length;
    if (totalItemsHeader) {
      setTotalItems(totalItemsHeader);
      setTotalPages(Math.ceil(totalItemsHeader / (selectView === "cards" ? itemsPerPageCards : itemsPerPageTable)));
    }
  }, [filteredData, selectView, filterChanged]);
  
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

  const startIndex = (currentPage - 1) * itemsPerPageCards;
  const endIndex = startIndex + (selectView === "cards" ? itemsPerPageCards : itemsPerPageTable);

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

  const handleViewTable = () => {
    setSelectedView("table")
  }

  const handleViewCards = () => {
    setSelectedView("cards")
  }

  const handleFilterChange = () => {
    setFilterChanged(true); // Marque que o filtro foi alterado
  };

  return (
    <div className="flex flex-wrap gap-4 justify-between bg-[#ebebeb] px-3 py-[18px] border-2">
      <header className="w-full grid grid-cols-1 items-center justify-center">

        <div className='w-full flex items-center justify-center pb-4'>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-24 select-none' />
        </div>

        <div className='sm:grid-cols-2 md:grid-cols-4 w-full flex flex-col items-center gap-3 sm:grid relative'>
        <Select onValueChange={(value) => {
  setSelectedProduct(value === "todos-produtos" ? null : value);
  handleFilterChange(); // Redefine a página ao alterar o filtro
}}>
  <SelectTrigger className="rounded text-white bg-[#282828]">
    <SelectValue placeholder="Produto" />
  </SelectTrigger>
  <SelectContent className="rounded bg-white text-[#282828]">
    <SelectItem value="todos-produtos">Todos</SelectItem>
    {productOptions.map((produto, index) => (
      <SelectItem key={index} value={String(produto)}>{produto}</SelectItem>
    ))}
  </SelectContent>
</Select>

<Select onValueChange={(value) => {
  setSelectedOrigin(value === "todas-origens" ? null : value);
  handleFilterChange(); // Redefine a página ao alterar o filtro
}}>
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

<Select onValueChange={(value) => {
  setSelectedDestination(value === "todos-destinos" ? null : value);
  handleFilterChange(); // Redefine a página ao alterar o filtro
}}>
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
          <TooltipProvider>
            <div className="lg:w-fit flex sm:absolute sm:right-0 sm:bottom-0">
              <div className={selectView === "cards" ?
                "p-2 hover:bg-[#3b3b3b25] text-[#282828] w-fit rounded-[6px] hover:cursor-pointer transition-all" :
                "p-2 bg-[#282828] text-white w-fit rounded-[6px] hover:cursor-pointer transition-all"
              }
                onClick={handleViewTable}
              >
                <Tooltip>
                  <TooltipTrigger asChild >
                    <FileSpreadsheet className="w-5"></FileSpreadsheet>
                  </TooltipTrigger>
                  <TooltipContent side='bottom' className="rounded-[5px] bg-[#3f3f3f] text-white">Ver em Tabela</TooltipContent>
                </Tooltip>
              </div>

              <div
                className={selectView === "table" ?
                  "p-2 hover:bg-[#3b3b3b25] text-[#282828] w-fit rounded-[6px] hover:cursor-pointer transition-all" :
                  "p-2 bg-[#282828] text-white w-fit rounded-[6px] hover:cursor-pointer transition-all"
                }
                onClick={handleViewCards}>
                <Tooltip>
                  <TooltipTrigger asChild >
                    <LayoutGrid className="w-5"></LayoutGrid>
                  </TooltipTrigger>
                  <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f] text-white">Ver Cartões</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </div>

      </header>

      {
        filteredData.length === 0 ?
          <div className="w-full h-full flex flex-col items-center justify-center
          bg-white rounded-xl">
            <div className="w-full h-full flex flex-col items-center justify-center md:pt-14"
            >
              <img className="w-fit h-[534px] select-none hidden sm:flex" src="https://i.imgur.com/tI5G1TR.jpeg" alt="" />
              <div className="h-[144px] text-base md:text-xl flex flex-col justify-center md:justify-normal items-center select-none ">
                <span>
                  Não há dados para esta consulta
                </span>
                <span>Tente Novamente</span>
              </div>
            </div>

          </div> :
          selectView === "table" ?
            <section className="w-full gap-4 border border-[#3b3b3b25] rounded-xl">
              <Table className="w-full h-full rounded-xl">
                <TableHeader className="bg-[#282828] text-white rounded-md text-xs sm:text-sm">
                  <TableRow className="">
                    <TableHead className='min-w-52 text-start'>Produto</TableHead>
                    <TableHead className='min-w-44'>NCM</TableHead>
                    <TableHead className='min-w-44 text-start'>Origem</TableHead>
                    <TableHead className='min-w-32 text-start'>Destino</TableHead>
                    <TableHead className='min-w-32'>UF Origem</TableHead>
                    <TableHead className='min-w-32'>UF Destino</TableHead>
                    <TableHead className='min-w-32'>ICMS</TableHead>
                    <TableHead className='min-w-32'>PIS/COFINS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {filteredData && filteredData.length > 0 ? (
                    <>
                      {filteredData.slice(startIndex, endIndex).map((item, index) => (
                        <TableRow key={index} className="hover:bg-[#3f3f3f] hover:text-white text-xs sm:text-sm">
                          <TableCell>{item.Produto}</TableCell>
                          <TableCell className="text-center">{item.NCM}</TableCell>
                          <TableCell>{item.Origem}</TableCell>
                          <TableCell>{item.Destino}</TableCell>
                          <TableCell className="text-center">{item["UF Origem"]}</TableCell>
                          <TableCell className="text-center">{item["UF Destino"]}</TableCell>
                          <TableCell className="text-center">{item["Pagamento ICMS"]}</TableCell>
                          <TableCell className="text-center">{item["Pagamento PIS/COFINS"]}</TableCell>
                        </TableRow>
                      ))}
                      {/* Adicionar linhas em branco para completar até 15 */}
                      {Array.from({ length: 15 - filteredData.length }).map((_, index) => (
                        <TableRow key={`empty-${index}`} className="text-xs sm:text-sm">
                          <TableCell colSpan={8} className="h-[46.1px]"></TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Nenhum dado encontrado</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section> :

            <section className="xl:min-h-[733px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-2 
        grid-rows-3 lg:grid-rows-2 gap-2 lg:gap-4 border border-[#3b3b3b25] p-2 lg:p-3 rounded-xl bg-[#3b3b3b10]
        2xl:grid-rows-3
        ">
              {
                filteredData ? (
                  filteredData.slice(startIndex, endIndex).map((item, index) => (
                    <div key={index} className="flex-col lg:flex-row 2xl:flex items-center p-3 lg:p-4 justify-between bg-[#ffffff] border border-[#dddddd]
                  rounded-xl text-white text-xs lg:max-w-[615px] 2xl:max-w-[630px] 2xl:max-h-[225px] lg:gap-4 ">

                      <div className="min-h-[200px] sm:text-clip lg:min-w-[200px] lg:min-h-[180px] xl:min-h-[140px] 2xl:min-w-[200px] 2xl:h-full bg-slate-100 relative rounded-xl"
                        style={{ backgroundImage: `url(${item.ImagemURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      >
                        <div className="flex w-fit items-center justify-center py-1 px-2 gap-1 left-2 top-2 rounded-[5px]
                  absolute bg-[#FFFFFF] font-semibold text-[10px] sm:text-xs text-[#463C3C]"
                        >
                          <h1>NCM</h1>
                          <p className="">{item.NCM}</p>
                        </div>
                        <div className="absolute right-2 top-2 text-sm xl:text-xs  lg:text-lg gap-1 text-[#ffffff] hidden xl:flex bg-[#282828] p-1 rounded-[8px] 2xl:hidden">
                          <h1 className="hidden">ID</h1>
                          <p>#{item.ID}</p>
                        </div>
                      </div>


                      <div className="flex flex-col 2xl:w-full lg:justify-between relative text-xs md:text-sm 2xl:text-base py-2 gap-3">
                        <div className="w-fit h-8">
                          <h1 className="text-[#463C3C] font-bold text-base  2xl:text-xl border-b border-[#e4e4e4]">      {item.Produto.includes('Picado') || item.Produto.includes('Picada') ||
                            item.Produto.includes('Congelados') || item.Produto.includes('Florete')
                            ? item.Produto.replace(/Picado|Picada|Florete|Congelados/g, match => {
                              if (match === "Picado" || match === "Picada") return "Pic.";
                              if (match === "Florete") return "Flo.";
                              if (match === "Congelados") return "Cong.";
                              return match; // Garantir que, caso o match não seja nenhum desses, ele retorna o match original
                            })
                            : item.Produto}</h1>
                        </div>

                        <div className="w-full px-1">
                          <div className="flex gap-1">
                            <h1 className="text-[#463C3C] font-bold">Origem:</h1>
                            <p className="text-[#7a7a7a]">{item.Origem.startsWith('Importado') ? item.Origem.replace("Importado", "Imp.") : item.Origem}</p>
                          </div>

                          <div className="flex gap-1">
                            <h1 className="text-[#463C3C]  font-bold">Destino:</h1>
                            <p className="text-[#7a7a7a]">{item.Destino}</p>
                          </div>

                          <div className="flex gap-1">
                            <h1 className="text-[#463C3C]  font-bold">Estado Origem:</h1>
                            <p className="text-[#7a7a7a]">{item["UF Origem"]}</p>
                          </div>

                          <div className="flex gap-1">
                            <h1 className="text-[#463C3C]  font-bold">Estado Destino:</h1>
                            <p className="text-[#7a7a7a]">{item["UF Destino"]}</p>
                          </div>
                        </div>

                        <div className="2xl:flex text-sm font-bold hidden justify-between gap-2 text-white">
                          <div className="bg-[#343434] p-1 flex items-center justify-center rounded-xl gap-1 w-full border border-[#e4e4e4] ">
                            <h1>PIS/COF -</h1>
                            <p>{item["Pagamento PIS/COFINS"]}</p>
                          </div>

                          <div className="flex items-center justify-center rounded-xl gap-1 w-full bg-emerald-600  border border-[#e4e4e4] ">
                            <h1>ICMS -</h1>
                            <p>{item["Pagamento ICMS"]}</p>
                          </div>
                        </div>
                        <div className="flex absolute right-0 top-2 text-sm  lg:text-lg gap-1 text-[#463C3C] xl:hidden 2xl:flex">
                          <h1 className="hidden">ID</h1>
                          <p>#{item.ID}</p>
                        </div>
                      </div>

                      <div className="flex 2xl:hidden justify-between xl:flex-col 2xl:flex-row gap-4 xl:gap-1 text-white text-[10px] md:text-sm first: font-bold">
                        <div className="bg-[#343434] p-1 flex items-center justify-center rounded-[6px] gap-1 w-full border border-[#e4e4e4] ">
                          <h1>PIS/COFINS -</h1>
                          <p>{item["Pagamento PIS/COFINS"]}</p>
                        </div>

                        <div className="flex p-1 items-center justify-center rounded-[6px] gap-1 w-full bg-emerald-600  border border-[#e4e4e4] ">
                          <h1>ICMS -</h1>
                          <p>{item["Pagamento ICMS"]}</p>
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

      }

      <div className="w-full h-fit xl:h-72 md:flex-row flex flex-col-reverse lg:flex items-center justify-center md:justify-between rounded-[8px] xl:max-h-16 p-4 bg-[#1d1d1d] text-white">
        <div className="flex px-4  py-2 items-center justify-between w-fit text-xs sm:text-sm gap-4">
          <div className="flex gap-2 ">
            <h1 className="w-full flex font-bold">Páginas: </h1>
            <span className="text-white font-normal">{totalPages ?? "Carregando..."}</span>
          </div>

          <div className="flex gap-2">
            <h1 className="w-full flex  font-bold">Total de Itens:</h1>
            <span className="text-white font-normal">{totalItems ?? "Carregando..."}</span>
          </div>
        </div>

        <div>

          <Pagination className="w-fit flex items-center justify-centertext-xs">
            <TooltipProvider>
              <PaginationContent >
                <Tooltip>
                  <TooltipTrigger asChild >
                    <PaginationItem

                    >
                      <a className={`${currentPage === 1 ? "text-gray-400 cursor-not-allowed p-2 flex items-center justify-center" :
                        "flex items-center justify-center hover:bg-[#282828] hover:border-[#3f3f3f] hover:rounded-xl p-2 hover:cursor-pointer"
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
                      </PaginationNext>
                    </PaginationItem>
                  </TooltipTrigger>
                  <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Página Inicial</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild >
                    <PaginationItem

                    >
                      <a className={`${currentPage === totalPages ? "text-gray-400 cursor-not-allowed p-2 flex items-center justify-center" :
                        "flex items-center justify-center hover:bg-[#282828] hover:border-[#3f3f3f] hover:rounded-xl hover:cursor-pointer p-2"
                        }`}
                        onClick={currentPage === totalPages ? undefined : handleLastPage}>
                        <ChevronLast className="w-4 h-4"></ChevronLast>
                      </a>
                    </PaginationItem>
                  </TooltipTrigger>
                  <TooltipContent side='top' className="rounded-[5px] bg-[#3f3f3f]">Última Página</TooltipContent>
                </Tooltip>
              </PaginationContent>
            </TooltipProvider>
          </Pagination>
        </div >
      </div>
    </div >
  );
}

export default Cards;
