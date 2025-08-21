
package com.devsuperior.dscommerce.utils;


import com.devsuperior.dscommerce.projections.IdProjection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utils {
    public static
    /*tipo genérico que vai representar o
    * tipo do Id pode ser Long mas tem app
    * que tem Id como string et*/ <ID> List<? extends IdProjection<ID>> replace
            (List<? extends IdProjection<ID>> orderedListByUser, /*recebe uma lista desse tipo*/
             List<? extends IdProjection<ID>>  unOrderdList) { /*recebe outra lista n ordernada desse tipo*/

        Map<ID, IdProjection<ID>> map = new HashMap<>(); /*Map é a interface
        hashMap é a clsse completa*/

        for (IdProjection<ID> obj: unOrderdList) {
            map.put(obj.getId(), obj);
        }

    List<IdProjection<ID>> result = new ArrayList<>();
    for (IdProjection<ID> obj : orderedListByUser) {
        result.add(map.get(obj.getId())); /*para cada objeto produto
        da Projection que é uma lista ordenada pelo oque usuário informar
        eu pego o id desse produto acesso a entidade produto no meu map
        correspondente a ele e adiciono o esse produto na lista result
        */
    }
    return result;
    }
}
