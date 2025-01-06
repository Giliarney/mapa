import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrazilMap from '@/components/pages/home/mapHomePage/BrazilMap';
import { CircleChevronRight, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

function Home() {
  const navigate = useNavigate();
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState('Selecione a Origem');
  const [buttonTitle, setButtonTitle] = useState<string | null>(null);

  
  const handleRegionClick = (regionId: string) => {

    if (selectedOrigin === null) {
      setSelectedOrigin(regionId);
      setButtonText('Selecione o Destino');
    } else if (selectedDestination === null) {
      setSelectedDestination(regionId);
      setButtonTitle('hidden')
    }


    {/*if (selectedDestination !== null) {
      setSelectedDestination(null)
    }*/}

  };

  const handleMouseOver = () => { };

  const handleMouseOut = () => { };

  // Filtra valores nulos antes de passar para o BrazilMap
  const selectedRegions = [
    ...(selectedOrigin ? [selectedOrigin] : []),
    ...(selectedDestination ? [selectedDestination] : [])
  ];

  function clearRegions() {
    setSelectedOrigin(null);
    setSelectedDestination(null);
    setButtonText('Selecione a Origem');
    setButtonTitle(null)
  }

  return (
    <div className='bg-slate-100 flex flex-col justify-center items-center overflow-hidden'>
      <div className='w-screen h-screen flex items-center md:justify-center flex-col py-8 px-8 gap-2 xl:gap-4 overflow-hidden'>
        <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-28 py-8 ' />
        <div className='flex items-center h-12 justify-center w-full'>
        <div className=''>
          <h1 className={(buttonTitle) === 'hidden' ? "hidden transition-all" : "text-base sm:text-xl lg:text-2xl  xl:text-3xl"}>{buttonText}</h1>
        </div>

        <div className={(buttonTitle === null) ? "hidden" : 'w-full items-center justify-center flex gap-4 sm:w-[360px] sm:items-center sm:justify-center'}>
          {selectedOrigin && selectedDestination && (
            <div className='flex justify-center items-center transition-all'>
              <Button 
                className='flex justify-center  items-center gap-2 text-xs text-[#282828] h-7  xl:h-10 sm:h-9 sm:text-sm w-fit bg-[#3b3b3b1a] border border-[#3b3b3b13] hover:bg-[#282828] hover:text-white rounded-[8px]'
                onClick={() => navigate(`/details?origin=${selectedOrigin}&destination=${selectedDestination}`)}
              >
                Ver Informações
                <CircleChevronRight className='w-4 sm:w-5 sm:flex'></CircleChevronRight>
              </Button>
            </div>
          )}

          {selectedOrigin && selectedDestination && (
            <div className='flex justify-center items-center'>
              <Button
                className='flex items-center gap-1 justify-center sm:gap-2 text-xs text-[#282828] h-7  xl:h-10 sm:h-9 sm:text-sm w-fit bg-[#3b3b3b1a] border border-[#3b3b3b13] hover:text-white hover:bg-red-500 rounded-[8px]'
                onClick={clearRegions}
              >
                Limpar
                <Trash className='w-3 sm:w-4'></Trash>
              </Button>
            </div>
          )}
        </div>
        </div>

        <BrazilMap
          onRegionClick={handleRegionClick}
          onRegionMouseOver={handleMouseOver}
          onRegionMouseOut={handleMouseOut}
          selectedRegions={selectedRegions}
        />
      </div>
    </div>
  );
}

export default Home;
