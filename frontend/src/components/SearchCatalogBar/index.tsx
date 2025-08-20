import { useEffect, useState } from 'react';
import './style.css';
import type { CategoryDTO } from '../../models/category';
import * as categoryService from '../../services/category-service';

type Props = {

    onSearch: Function;

}


export default function SearchCatalogBar({ onSearch }: Props) {

    const [text, setText] = useState<string>("");

    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);

    useEffect(() => {
        categoryService.findAllRequest()
            .then(response => {
                const allCategory: CategoryDTO = { id: 0, name: "Categorias" };
                setCategories([allCategory, ...response.data]);
                setSelectedCategory(allCategory); // Todas categorias como padrão
                console.log(allCategory);
            })
            .catch(error => {
                console.log("Erro ao buscar categorias", error);
            })

    }, []);

    function handleClickReset() {
        setText('');
        onSearch(" ", categories[0].id);
        setSelectedCategory(categories[0]);
    }

    function handleInputChange(event: any) {

        setText(event.target.value);

    }

    function handleCategoryChange(event: any) {

        const categoryId = parseInt(event.target.value, 10);
        const category = categories.find(cat => cat.id === categoryId);
        console.log("Categoria selecionada:", categoryId, "Objeto:", category);

        // Atualize o estado aqui.
        setSelectedCategory(category || null);

        // Agora chame a busca.
        onSearch(text, categoryId);
    }

    function handleFormSubmit(event: any) {
        event.preventDefault();
        onSearch(text, selectedCategory ? selectedCategory.id : null);
        console.log(text, selectedCategory);
    }

    return (
        <>

            <div className="dscatalog-search-bar-container">


                <div className="dscatalog-serach-bar-details-container">


                    <form onSubmit={handleFormSubmit}
                        className="dscatalog-input-search">
                        <input value={text} type="text" placeholder="Nome do produto" onChange={handleInputChange} />
                        <button type="submit">🔎︎</button>
                    </form>
                    <div className="dscatalog-bar-category">
                        <select className="dscatalog-select"

                            onChange={handleCategoryChange}
                            value={selectedCategory?.id}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            
                            ))}
                        </select>
                        <button name="reset" onClick={handleClickReset} >LIMPAR FILTRO</button>
                    </div>
                </div>

            </div>

        </>
    );
}