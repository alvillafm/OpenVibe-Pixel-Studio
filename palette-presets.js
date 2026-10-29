/* Original curated palettes inspired by retro games, animation and natural color harmonies. */
const pixelPalettePresets=[
 ['8 bits GBC1','Aventura luminosa · verdes, cielo y coral','182442 304878 4078a0 60b8c0 a0e0d0 e8f8d8 305038 508048 88b850 c8e080 784058 b85868 e88078 f8b898 a86840 f0d088'],
 ['8 bits GBC2','Bosques de otoño · ámbar y ciruela','281c38 483050 704068 a86080 c888a0 f0b8b0 f8e8c8 584838 886040 b89050 e0c078 284850 407068 70a888 a8d0a0 d87048'],
 ['16 bits SNES1','Aventura fantástica · colores vivos y sombras violetas','181830 303050 505078 787898 a8a8c0 e0d8d0 fff0d8 283858 385888 5078b0 70a8d0 a0d8e0 204840 306848 509858 80c070 b8e090 604030 906048 c89060 f0c090 683848 a84858 d86868 f89888 f8c8a0 583870 885098 b878b8 e0a0d0 b08840 f0d070'],
 ['16 bits SNES2','Crepúsculo épico · zafiro, jade y oro','181828 282848 404070 606098 9090c0 c8c0e0 f0e0e8 fff0d0 203858 305888 4888b0 70b8c8 a8e0d8 204838 387058 60a080 90d0a0 c8e8b0 603048 904068 c06088 e890a0 f8c0b8 684038 986040 c89050 e8b868 f8d898 503868 805088 b880b8 d8b0d0'],
 ['Anime 1','Sakura · piel cálida, rosa y lavanda','29243d 4b385b 715071 9c6a83 c78d9b e7b2b7 f5d7ce fff0e5 693c57 9d506d d47391 f0a5bb f9ccdb 49456d 70679b a39ac5 d4cceb 365d60 548780 83b5a4 bce0cc a67049 d4a36b f4d49b'],
 ['Anime 2','Ciudad nocturna · cian, magenta y luces ácidas','10162f 20274c 393b70 5f5896 9281bd c7b4df f4e6f5 fffff0 185470 247c98 37acc0 76d7df b8f2eb 64315e 983a78 d14d94 f17db0 f6b6cf 806036 b58c43 e5b959 f9df94 4d6e64 83b6a1'],
 ['Anime 3','Cielo de verano · azules suaves y tonos de piel','253650 405979 6382a0 91adc3 c4d9e5 f0f7f2 fff7e8 735359 a97879 d4a29a f0c4b1 f9dfca 385e61 548d89 85bbb0 bce0ce 54577f 807ba5 b3a7ce ded4eb a7814d d1b476 efda9f f8ecbe'],
 ['Anime 4','Sol cinematográfico · coral, oro y sombras índigo','292239 443051 674464 936178 c28b94 e7b4ad f8d8c4 fff1d6 723e43 a34e49 d96d56 f39b72 f8c292 855735 b78645 ddb15e f5d98f 293f55 3e6479 66969e 9bc7bd 4f4e73 8b78a2 c7a9c9'],
 ['Bosque encantado','Musgo, jade y destellos de hada','172d35 294949 3f6960 608e73 92b892 c6d9ae e9edca f8f5de 49364c 76516a a6758a d7a5ad 856a43 b49b62 dbc987 f0dfb0'],
 ['Atardecer coral','Melocotón, terracota y mar turquesa','33283f 5a3b55 86536a b66f7c de8c8c f4b09b f9d1b2 fcebd4 345365 48798a 6ba1aa a1c8c6 d3e5d8 9e6845 d49a61 f2c982'],
 ['Noche de neón','Lavanda eléctrica y luces sobre asfalto','0e142b 20203f 36315d 57447e 875f9f bb8ebd eac0db fbe6ed 154a65 227a94 36b0bd 7ae1d8 9d365f dd5181 f18eaa e4d66d'],
 ['Café y tinta','Papel crema · cacao, oliva y azul humo','252b35 41434b 626069 8e8588 bab0aa dfcfc0 f1e4d0 fbf3e4 513e3b 7e5750 ab7d66 d3aa87 4f615c 809184 596b80 94a5b3'],
 ['Océano profundo','Abisales, espuma y corales luminosos','102b42 17435b 235f75 337f8c 53a2aa 83c6c6 b8e3da e9f5e3 343759 59547f 8d7da3 bbadca 9e5268 d57e84 f2b2a0 f4dbbd'],
 ['Desierto mágico','Dunas doradas y oasis de turquesa','392b40 604054 8a5867 b5797d dca08c f0c49d f8e1b3 fbf0d4 6b4939 a17047 d7a25d ecca7c 28565b 488b89 86bbb0 c1ddc1'],
 ['Aurora polar','Verde boreal, hielo y violeta profundo','14283d 243d58 3b5975 617a94 96abbc cad9df eaf1ec f9fae8 26544f 398477 63b59a a3dbc0 514368 7f6598 af95bf decbe3'],
 ['Caramelo pastel','Fresa, pistacho y crema con sombras suaves','40364f 6c5778 9b81a2 c5a8c7 e6cedf f7e9eb fff5df d6b49c f0cda9 936b80 c98ea0 eeb4bc 628b86 94bab0 c9dfc4 b4c7e5']
].map(([name,description,hex],index)=>({id:'preset-'+(index+1),name,description,colors:hex.split(' ').map(value=>'#'+value)}));
if(typeof module!=='undefined')module.exports=pixelPalettePresets;
