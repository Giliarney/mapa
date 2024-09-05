import React from 'react';
import {CircleArrowLeft, Search} from "lucide-react"
import BrazilMap from './map';
import {Button} from "@/components/ui/button"
import TableInfos from "./Table"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';

const RegionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='h-screen w-screen flex-col bg-slate-100'>

      <header className="w-screen h-16 bg-white flex items-center justify-center">
        <div>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-32' />
        </div>
      </header>

      <div className='flex items-center'>
        <div className='w-[640px] flex flex-col justify-center items-center'>
          <div className=' flex items-start place-self-start px-4'>
            <Button className='w-12 h-12 rounded-full px-0 py-0'>
              <CircleArrowLeft className='w-14 h-14 p-1 text-slate-400 hover:bg-slate-900 hover:rounded hover:text-white' onClick={() => navigate(`/`)} />
            </Button>
          </div>

          <div className='flex items-center justify-center'>
            <BrazilMap/>
          </div>
        </div>

        <div className='w-screen my-12 h-full flex flex-col justify-center items-center'>
          <div className='flex items-center justify-center w-full h-16 bg-slate-300'>
            <h1 className='text-3xl'>Tributação</h1>
          </div>
          
          <div className='w-full flex items-center justify-between px-4 py-4'>
            <div className='flex items-center gap-2'>
              <div>
                <Select>
                  <SelectTrigger className="w-[180px] rounded">
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
                  <SelectTrigger className="w-[180px] rounded">
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
                  <SelectTrigger className="w-[180px] rounded">
                    <SelectValue placeholder="Destino" />
                  </SelectTrigger>
                  <SelectContent className='bg-slate-100 rounded'>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="comercio">Comércio</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='w-52 relative flex items-center px-4'>
              <Search className='absolute right-4'></Search>
              <Input placeholder='Buscar' className='rounded w-52'>
              </Input>
            </div>
            
          </div>

          <TableInfos></TableInfos>

        </div>
      </div>
    </div>
  );
};


export default RegionPage;