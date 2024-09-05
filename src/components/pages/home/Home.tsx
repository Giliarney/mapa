import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrazilMap from '@/components/brazilmap/BrazilMap';

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


    if (selectedDestination !== null) {
      setSelectedDestination(null)
    }

  };

  const handleMouseOver = () => {};

  const handleMouseOut = () => {};

  // Filtra valores nulos antes de passar para o BrazilMap
  const selectedRegions = [
    ...(selectedOrigin ? [selectedOrigin] : []),
    ...(selectedDestination ? [selectedDestination] : [])
  ];

  return (
    <div className='w-screen h-screen bg-slate-50'>
      <header className="w-screen h-16 bg-white flex items-center justify-center">
        <div>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-32' />
        </div>
      </header>

      <div className='flex items-center justify-center flex-col px-8 py-8'>
        <div>
          <h1 className='text-3xl'>{buttonText}</h1>
        </div>

        <div className='py-12'>
            {selectedOrigin && selectedDestination && (
              <button
                className='h-[48px] w-[240px] border bg-slate-200 hover:bg-slate-900 hover:text-slate-50 rounded-2xl text-base'
                onClick={() => navigate(`/details`)}
              >
                Ver Informações
              </button>
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
