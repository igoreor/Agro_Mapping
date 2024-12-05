<template>
    <section id="sobre">
        <div class="sobre-content">
            <h2>Sobre o AgroMapping</h2>
            <div class="sobre-columns">
                <div class="sobre-column">
                    <p>A aplicação é uma plataforma de comércio eletrônico que conecta compradores e vendedores,
                        facilitando o processo de compra, venda e avaliação de produtos.</p>
                    <p>A plataforma possui dois tipos principais de usuários: compradores e vendedores. Cada usuário tem
                        um perfil com informações essenciais como nome de usuário e email.</p>
                </div>
                <div class="sobre-column">
                    <p>Compradores podem navegar e pesquisar produtos listados pelos vendedores, utilizando filtros para
                        encontrar itens específicos. Após a compra, compradores podem deixar avaliações.</p>
                </div>
            </div>
            <div class="nuvem-fala">
                <p>O Agrocommerce conecta compradores e vendedores de maneira simples e eficiente!</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'SobreSection',
};
</script>

<style scoped>
/* Estilos específicos para a seção Sobre */
#sobre {
    padding: 40px;
    background-color: #f9f9f9;
}

.sobre-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.sobre-content h2 {
    font-size: 36px;
}

.sobre-columns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.sobre-column {
    width: 48%;
    text-align: left;
    font-size: 18px;
    line-height: 1.6;
}

.nuvem-fala {
    margin-top: 68px;
    padding: 20px;
    background-color: gray;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    color: white;
    font-size: 20px;
    position: relative;
}

.nuvem-fala:after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 20px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent gray transparent;
}
</style>