import React from 'react';
import { useParams } from 'react-router-dom';

// Tipo para os dados da região
interface RegionData {
  name: string;
  info: string;
}

type RouteParams = {
    regionId: string | undefined;  // O valor pode ser string ou undefined
  };

const RegionPage: React.FC = () => {
  const { regionId } = useParams<RouteParams>();

  // Dados das regiões (preencha com dados reais)
  const regionData: { [key: string]: RegionData } = {
    'BR-AC': {
      name: 'Acre',
      info: 'Rio Branco é a capital do Acre. O estado é conhecido por sua floresta amazônica e por ter a maior parte de sua área em terras baixas.',
    },
    'BR-AL': {
      name: 'Alagoas',
      info: 'Maceió é a capital de Alagoas. O estado é conhecido por suas belas praias e pela produção de açúcar e álcool.',
    },
    'BR-AM': {
      name: 'Amazonas',
      info: 'Manaus é a capital do Amazonas. O estado é o maior do Brasil e abriga a maior parte da floresta amazônica.',
    },
    'BR-AP': {
      name: 'Amapá',
      info: 'Macapá é a capital do Amapá. O estado é conhecido por sua floresta amazônica e por ter a maior parte de sua área em terras baixas.',
    },
    'BR-BA': {
      name: 'Bahia',
      info: 'Salvador é a capital da Bahia. O estado é conhecido por suas belas praias, sua cultura rica e por ter a maior produção de cacau do Brasil.',
    },
    'BR-CE': {
      name: 'Ceará',
      info: 'Fortaleza é a capital do Ceará. O estado é conhecido por suas belas praias, seu artesanato e por ter a maior produção de castanhas do Brasil.',
    },
    'BR-DF': {
      name: 'Distrito Federal',
      info: 'Brasília é a capital do Brasil. O Distrito Federal é uma região administrativa que abriga os poderes da União.',
    },
    'BR-ES': {
      name: 'Espírito Santo',
      info: 'Vitória é a capital do Espírito Santo. O estado é conhecido por suas belas praias, suas cachoeiras e por ter a maior produção de café do Brasil.',
    },
    'BR-GO': {
      name: 'Goiás',
      info: 'Goiânia é a capital de Goiás. O estado é conhecido por sua produção agropecuária e por ter a maior produção de soja do Brasil.',
    },
    'BR-MA': {
      name: 'Maranhão',
      info: 'São Luís é a capital do Maranhão. O estado é conhecido por sua produção agropecuária e por ter a maior produção de arroz do Brasil.',
    },
    'BR-MG': {
      name: 'Minas Gerais',
      info: 'Belo Horizonte é a capital de Minas Gerais. O estado é conhecido por sua produção agropecuária e por ter a maior produção de café do Brasil.',
    },
    'BR-MS': {
      name: 'Mato Grosso do Sul',
      info: 'Campo Grande é a capital de Mato Grosso do Sul. O estado é conhecido por sua produção agropecuária e por ter a maior produção de soja do Brasil.',
    },
    'BR-MT': {
      name: 'Mato Grosso',
      info: 'Cuiabá é a capital de Mato Grosso. O estado é conhecido por sua produção agropecuária e por ter a maior produção de soja do Brasil.',
    },
    'BR-PA': {
      name: 'Pará',
      info: 'Belém é a capital do Pará. O estado é conhecido por sua floresta amazônica e por ter a maior produção de castanhas do Brasil.',
    },
    'BR-PB': {
      name: 'Paraíba',
      info: 'João Pessoa é a capital da Paraíba. O estado é conhecido por suas belas praias, sua produção de cana-de-açúcar e por ter a maior produção de manga do Brasil.',
    },
    'BR-PE': {
      name: 'Pernambuco',
      info: 'Recife é a capital de Pernambuco. O estado é conhecido por suas belas praias, sua cultura rica e por ter a maior produção de açúcar do Brasil.',
    },
    'BR-PI': {
      name: 'Piauí',
      info: 'Teresina é a capital do Piauí. O estado é conhecido por sua produção agropecuária e por ter a maior produção de arroz do Brasil.',
    },
    'BR-PR': {
      name: 'Paraná',
      info: 'Curitiba é a capital do Paraná. O estado é conhecido por sua produção agropecuária e por ter a maior produção de café do Brasil.',
    },
    'BR-RJ': {
      name: 'Rio de Janeiro',
      info: 'Rio de Janeiro é a capital do estado do Rio de Janeiro. O estado é conhecido por suas belas praias, sua cultura rica e pelo Cristo Redentor.',
    },
    'BR-RN': {
      name: 'Rio Grande do Norte',
      info: 'Natal é a capital do Rio Grande do Norte. O estado é conhecido por suas belas praias, suas dunas e por ter a maior produção de sal do Brasil.',
    },
    'BR-RO': {
      name: 'Rondônia',
      info: 'Porto Velho é a capital de Rondônia. O estado é conhecido por sua floresta amazônica e por ter a maior produção de madeira do Brasil.',
    },
    'BR-RR': {
      name: 'Roraima',
      info: 'Boa Vista é a capital de Roraima. O estado é conhecido por sua floresta amazônica e por ter a maior produção de ouro do Brasil.',
    },
    'BR-RS': {
      name: 'Rio Grande do Sul',
      info: 'Porto Alegre é a capital do Rio Grande do Sul. O estado é conhecido por sua produção agropecuária e por ter a maior produção de vinho do Brasil.',
    },
    'BR-SC': {
      name: 'Santa Catarina',
      info: 'Florianópolis é a capital de Santa Catarina. O estado é conhecido por suas belas praias, sua produção agropecuária e por ter a maior produção de carne suína do Brasil.',
    },
    'BR-SE': {
      name: 'Sergipe',
      info: 'Aracaju é a capital de Sergipe. O estado é conhecido por suas belas praias, sua produção de cana-de-açúcar e por ter a maior produção de coco do Brasil.',
    },
    'BR-SP': {
      name: 'São Paulo',
      info: 'São Paulo é a capital do estado de São Paulo. O estado é o mais populoso do Brasil e é conhecido por sua indústria, sua cultura rica e por ter a maior produção de café do Brasil.',
    },
    'BR-TO': {
      name: 'Tocantins',
      info: 'Palmas é a capital do Tocantins. O estado é conhecido por sua produção agropecuária e por ter a maior produção de arroz do Brasil.',
    },
  };

  const regionInfo = regionId ? regionData[regionId] : undefined;

  return (
    <div>
      <h1>{regionInfo?.name || 'Região não encontrada'}</h1>
      <p>{regionInfo?.info || 'Informações não disponíveis'}</p>
    </div>
  );
};

export default RegionPage;