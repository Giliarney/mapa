import React from 'react';
import {CircleArrowLeft, Search} from "lucide-react"
import BrazilMap from './map';
import {Button} from "@/components/ui/button"
import TableInfos from "./Table"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

const RegionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedOrigin = searchParams.get("origin");
  const selectedDestination = searchParams.get("destination");

  const selectedRegions = [
    ...(selectedOrigin ? [selectedOrigin] : []),
    ...(selectedDestination ? [selectedDestination] : [])
  ];


  return (
    <div className='h-full w-screen flex-col'>

      <header className=" h-16 bg-white flex items-center justify-center">
        <div>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-32' />
        </div>
      </header>

      <div className='flex items-center w-full h-full flex-col'>
        <div className='w-full h-full flex flex-col justify-center items-center relative bg-slate-100'>
          <div className='w-full flex items-center justify-center relative px-4'>
            <Button className='w-12 h-12 rounded-full px-0 py-0 absolute left-4 top-4'>
              <CircleArrowLeft className='w-14 h-14 text-slate-400 hover:rounded hover:text-slate-600 transition ease-in' onClick={() => navigate("/")} />
            </Button>
            <BrazilMap 
            selectedRegions={selectedRegions}
            />
          </div>
        </div>

        <div className='w-full h-full flex flex-col justify-center items-center '>
          <div className='flex items-center justify-center w-full h-16 border-t'>
            <h1 className='text-3xl'>Tributação</h1>
          </div>
          
          <div className='w-full flex items-center justify-between px-4 py-4 bg-white border-t border-b'>
            <div className='flex gap-2 sm:flex sm:items-center sm:gap-2 '>
              <div>
                <Select>
                  <SelectTrigger className="w-[120px] rounded border-slate-300 text-slate-400">
                    <SelectValue placeholder="Produto" />
                  </SelectTrigger>
                  <SelectContent className='bg-slate-100 rounded'>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="morangoInNatura">Morango InNatura</SelectItem>
                    <SelectItem value="morangoCongelado">Morango Congelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select>
                  <SelectTrigger className="w-[120px] rounded border-slate-300 text-slate-400">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent className='bg-slate-100 rounded'>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="egito">Egito</SelectItem>
                    <SelectItem value="nacional">Nacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select>
                  <SelectTrigger className="w-[120px] rounded border-slate-300 text-slate-400">
                    <SelectValue placeholder="Destino" />
                  </SelectTrigger>
                  <SelectContent className='bg-slate-100 rounded '>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="comercio">Comércio</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='w-52 relative flex items-center px-4'>
              <Search className='absolute right-4 text-slate-400'></Search>
              <Input placeholder='Buscar' className='rounded w-52 border-slate-300 text-slate-400'>
              </Input>
            </div>
            
          </div>

          <div className='bg-white sm:w-screen'>
            <TableInfos></TableInfos>
          </div>


        </div>
      </div>
    </div>
  );
};


export default RegionPage;