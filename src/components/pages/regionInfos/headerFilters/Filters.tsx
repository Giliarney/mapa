import {Search} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

const Filters: React.FC = () => {
    return (
        <header className="w-full flex gap-2 py-4">
                 
                <div className='w-full flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4'>
                        <Select>
                            <SelectTrigger className=" rounded text-slate-700 border-slate-300">
                                <SelectValue placeholder="Produto"/>
                            </SelectTrigger>

                            <SelectContent className='rounded bg-white'>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="todos">Todos</SelectItem>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="morangoInNatura">Morango InNatura</SelectItem>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="morangoCongelado">Morango Congelado</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className=" rounded border-slate-300 text-slate-700">
                                <SelectValue placeholder="Origem" />
                            </SelectTrigger>
                            
                            <SelectContent className='bg-white text-slate-700 rounded'>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="todos">Todos</SelectItem>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="egito">Egito</SelectItem>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="nacional">Nacional</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className=" rounded border-slate-300 text-slate-700">
                                <SelectValue placeholder="Destino" />
                            </SelectTrigger>

                            <SelectContent className='bg-white text-slate-700 rounded'>
                                <SelectItem  value="todos">Todos</SelectItem>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="comercio">Comércio</SelectItem>
                                <SelectItem className='rounded hover:bg-slate-700 hover:text-white transition-all' value="industria">Indústria</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className='w-full relative flex items-center'>
                            <Search className='absolute right-3 text-slate-500'></Search>
                            <Input placeholder='Buscar' className='rounded border-slate-300 text-slate-700'></Input>
                        </div>
                </div>
        </header>
    )
};

export default Filters;