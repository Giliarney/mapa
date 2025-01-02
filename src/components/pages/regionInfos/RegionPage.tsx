import React from 'react';
import {CircleArrowLeft, ArrowRight} from "lucide-react"
import BrazilMap from './mapRegionPage/map';
import {Button} from "@/components/ui/button"
{/*import TableInfos from "../../table/Table"*/}
import Cards from "../../cards/Cards"
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
    <div className='flex w-full lg:h-screen flex-col p-2 gap-3'>

      <header className=" h-16 bg-white flex items-center justify-center">
        <div className='w-full flex items-center justify-center'>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-32'/>
        </div>
      </header>

        <div className='flex flex-col h-full lg:flex-row items-center justify-center'>
          <div className='flex flex-col justify-center items-center relative gap-4'>
            <div className='flex w-fit px-4 py-2 items-center justify-center gap-4 text-lg
            bg-[#ffffff] rounded-[10px] border border-[#7a7a7a]'>
              <h1 className="text-[#7a7a7a]">Estado Origem: <span className='text-[#463C3C]'>{selectedOrigin}</span></h1>
              <ArrowRight className='w-8 h-8 text-emerald-600' onClick={() => navigate("/")} />
              <h1 className="text-[#7a7a7a]">Estado Destino: <span className='text-[#463C3C]'>{selectedDestination}</span></h1>
            </div>
            <div className='flex items-center justify-center relative px-4 bg-slate-50'>
              <Button className='w-10 h-10 sm:w-12 sm:h-12 text-slate-700 px-0 py-0 absolute left-4 top-4 hover:rounded hover:text-white p-2 hover:bg-slate-700 transition-all'>
                <CircleArrowLeft className='w-8 h-8' onClick={() => navigate("/")} />
              </Button>
              <BrazilMap selectedRegions={selectedRegions}/>
            </div>
          </div>

          <div className='w-full h-full'>
            {/*<div className='flex items-center justify-center w-full h-16 border-t rounded'>
              <h1 className='text-xl sm:text-3xl text-center rounded text-white bg-slate-700 w-full p-4'>Tributação</h1>
            </div>*/}

            <Cards></Cards>
            {/*<TableInfos></TableInfos>*/}
          </div>


        </div>
    </div>
  );
};


export default RegionPage;