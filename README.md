
body {

            cursor: url("img/cursor-1.png") 16 16, auto;
        }

        button {
            cursor: url("img/cursor-2.png") 16 16, auto;


            font-family: "Parkinsans", sans-serif;
            /* cursor global: tenta .cur primeiro, depois PNG, depois auto */
            cursor: url('img/cursor.cur'), url('img/cursor-1.png') 16 16, auto !important;
        }

         button,
        .btn,
        a,
        .nav-link,
        .dropdown-item {
            cursor: url('img/cursor-pointer.cur'), url('img/cursor-1.png') 16 16, pointer !important;
            transition: transform .06s ease;
            -webkit-tap-highlight-color: transparent;
        }

        /* Cursor e efeito ao clicar */
        button:active,
        .btn:active,
        a:active {
            cursor: url('img/cursor-click.cur'), url('img/cursor-2.png') 16 16, pointer !important;
            transform: translateY(1px) scale(.995);
        }
