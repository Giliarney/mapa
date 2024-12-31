import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrazilMap from '@/components/pages/home/mapHomePage/BrazilMap';
import { CircleChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function Home() {
  const navigate = useNavigate();
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState('Selecione a Origem');

  const handleRegionClick = (regionId: string) => {

    if (selectedOrigin === null) {
      setSelectedOrigin(regionId);
      setButtonText('Selecione o Destino');
    } else if (selectedDestination === null) {
      setSelectedDestination(regionId);
    }


    {/*if (selectedDestination !== null) {
      setSelectedDestination(null)
    }*/}

  };

  const handleMouseOver = () => {};

  const handleMouseOut = () => {};

  // Filtra valores nulos antes de passar para o BrazilMap
  const selectedRegions = [
    ...(selectedOrigin ? [selectedOrigin] : []),
    ...(selectedDestination ? [selectedDestination] : [])
  ];

  function clearRegions () {
    setSelectedOrigin(null)
    setSelectedDestination(null)
    setButtonText('Selecione a Origem')
  }

  return (
    <div className='w-screen h-screen bg-slate-100'>
      <header className="w-screen h-16 bg-white flex items-center justify-center">
        <div>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-32' />
        </div>
      </header>

      <div className='w-screen flex items-center justify-center flex-col py-8 px-8 bg-slate-100'>
        <div>
          <h1 className='text-base sm:text-[24px] md:text-[32px]'>{buttonText}</h1>
        </div>

        <div className='w-full items-center justify-center h-12 py-12 flex gap-2 sm:w-[360px] sm:items-center sm:justify-center'>
          {selectedOrigin && selectedDestination && (
            <div className='hover:text-slate-50'>
              <Button
                className='flex justify-center sm:gap-2 sm:text-base text-slate-700 h-10 w-36 sm:h-[48px] sm:w-[180px] items-center bg-slate-200 hover:bg-slate-700 hover:text-white rounded-2xl text-base'
                onClick={() => navigate(`/details?origin=${selectedOrigin}&destination=${selectedDestination}`)}
              >
                Ver Informações
                <CircleChevronRight className='hidden sm:flex'></CircleChevronRight>
              </Button>
            </div>
          )}

          {selectedOrigin && selectedDestination && (              
            <div>
              <Button
                className='text-slate-700 h-10 w-32 sm:h-[48px] sm:w-[80px] text-sm border bg-slate-200 hover:bg-red-500 hover:text-slate-50 rounded-2xl sm:text-base'
                onClick={clearRegions}
              >
                Limpar
              </Button>
            </div>
          )}
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
