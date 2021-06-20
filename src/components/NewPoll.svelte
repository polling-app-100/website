<div class="box">
    <h2 class="subtitle">Wanna Join The Fun ?</h2> 
    <a class="button is-link" href="/createPoll">Create Poll</a>
</div>

<style>
    div.box {
        border: 2px #50cba3 solid;
        display: grid;
        grid-template-areas: 'left center right';
    }

    h2.subtitle { 
        height: 30px;
        grid-row-start: left;
        grid-row-end: center;
        margin-bottom: 0;
    }

    a {
        grid-area: right;
    }
</style>