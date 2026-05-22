/* =========================================================================
   RetroGuesser · Adivina el año
   ========================================================================= */
(function () {
  'use strict';

  /* ----------------------------- CATEGORIES ------------------------------ */
  const CATEGORIES = {
    videojuegos: { id:'videojuegos', name:'Videojuegos', emoji:'🎮', color:'#a78bfa',
      labelColor:'#3a2545', yearMin:1970, yearMax:2026, defaultYear:1995 },
    futbol:      { id:'futbol', name:'Fútbol', emoji:'⚽', color:'#66bb6a',
      labelColor:'#234223', yearMin:1900, yearMax:2026, defaultYear:1990 },
    cine:        { id:'cine', name:'Cine & Series', emoji:'🎬', color:'#ef5350',
      labelColor:'#4a1818', yearMin:1895, yearMax:2026, defaultYear:1980 },
    ciudades:    { id:'ciudades', name:'Ciudades', emoji:'🏙️', color:'#4fc3f7',
      labelColor:'#163545', yearMin:1860, yearMax:2026, defaultYear:1980 },
    historia:    { id:'historia', name:'Historia', emoji:'🌍', color:'#f5c518',
      labelColor:'#3d2e10', yearMin:1860, yearMax:2026, defaultYear:1960 },
    variado:     { id:'variado', name:'Variado', emoji:'🎲', color:'#ff79c6',
      labelColor:'#4a1c3a', yearMin:1860, yearMax:2026, defaultYear:1980, isVariado:true }
  };

  const FB = (file, w = 900) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;
  /* Image data is loaded from js/data/<category>.js — one file per category
     so you can edit/add entries without touching the main app code.
     Each data file does: window.PXL_DATA.<cat> = [ { file, year, title, fact }, ... ] */
  const FALLBACK_IMAGES_RAW = (window.PXL_DATA || {});
  const _UNUSED_INLINE_FALLBACK = {
    historia: [
      { file:'Lange-MigrantMother02.jpg', year:1936, title:'Migrant Mother', fact:'Retrato de Florence Owens Thompson por Dorothea Lange durante la Gran Depresión.' },
      { file:'Raising_the_Flag_on_Iwo_Jima,_larger_-_edit1.jpg', year:1945, title:'Izando la bandera en Iwo Jima', fact:'Joe Rosenthal capturó la imagen el 23 de febrero de 1945.' },
      { file:'NASA-Apollo8-Dec24-Earthrise.jpg', year:1968, title:'Earthrise', fact:'William Anders fotografió la Tierra desde el Apolo 8 en Nochebuena.' },
      { file:'Aldrin_Apollo_11_original.jpg', year:1969, title:'Buzz Aldrin en la Luna', fact:'Neil Armstrong fotografió a Aldrin durante el primer alunizaje tripulado.' },
      { file:'Hindenburg_disaster.jpg', year:1937, title:'Desastre del Hindenburg', fact:'El dirigible LZ 129 ardió en Lakehurst, Nueva Jersey, el 6 de mayo de 1937.' },
      { file:'Orville_Wright_1905-crop.jpg', year:1905, title:'Orville Wright', fact:'Retrato del pionero de la aviación dos años después del primer vuelo.' },
      { file:'Albert_Einstein_Head_cleaned.jpg', year:1947, title:'Albert Einstein', fact:'Retrato realizado por Oren J. Turner, uno de los más reproducidos del físico.' },
      { file:'Anne_Frank_passport_photo,_May_1942_(cropped).jpg', year:1942, title:'Anne Frank', fact:'Foto de pasaporte tomada poco antes de esconderse con su familia en Ámsterdam.' },
      { file:'Buzz_Aldrin.jpg', year:1969, title:'Buzz Aldrin', fact:'Retrato oficial de la NASA del astronauta del Apolo 11.' },
      { file:'British_Airways_Concorde_G-BOAC_03.jpg', year:2003, title:'Concorde G-BOAC', fact:'El avión supersónico realizó sus últimos vuelos comerciales en octubre de 2003.' },
      { file:'IAEA_02790015_(5613115146).jpg', year:1986, title:'Chernóbil', fact:'Documentación del accidente nuclear del 26 de abril de 1986.' },
      { file:'The_station_pictured_from_the_SpaceX_Crew_Dragon_5.jpg', year:2022, title:'Estación Espacial Internacional', fact:'Imagen de la ISS desde el SpaceX Crew Dragon 5 (Crew-5).' },
      { file:'Ford_Island_aerial_photo_RIMPAC_1986.JPEG', year:1986, title:'Ford Island, Pearl Harbor', fact:'Vista aérea durante el ejercicio RIMPAC 1986 en la histórica base naval.' },
      { file:'Apollo_program.svg.png', year:1969, title:'Apollo Program', fact:'Programa espacial de la NASA que llevó al ser humano a la Luna.' },
      { file:'Sir_Winston_Churchill_-_19086236948_(restored).jpg', year:1942, title:'Winston Churchill', fact:'Primer ministro británico durante la Segunda Guerra Mundial.' },
      { file:'Hitler_portrait_crop_(cropped)(2).jpg', year:1937, title:'Adolf Hitler', fact:'Líder del Tercer Reich antes del estallido de la guerra.' },
      { file:'FDR-1944-Campaign-Portrait_(3x4_retouched,_cropped).jpg', year:1944, title:'Franklin D. Roosevelt', fact:'Retrato de campaña del 32º presidente de EEUU.' },
      { file:'StalinCropped1943.jpg', year:1943, title:'Iósif Stalin', fact:'Líder soviético durante la Segunda Guerra Mundial.' },
      { file:'De_Gaulle-OWI.jpg', year:1942, title:'Charles de Gaulle', fact:'Líder de la Francia Libre durante la guerra.' },
      { file:'John_F._Kennedy,_White_House_color_photo_portrait.jpg', year:1961, title:'John F. Kennedy', fact:'Retrato oficial del 35º presidente de EEUU.' },
      { file:'Martin_Luther_King,_Jr..jpg', year:1964, title:'Martin Luther King Jr.', fact:'Líder del movimiento por los derechos civiles, año del Nobel.' },
      { file:'Elvis_Presley_promoting_Jailhouse_Rock.jpg', year:1957, title:'Elvis Presley', fact:'Foto promocional para la película Jailhouse Rock.' },
      { file:'The_Beatles_1963_Dezo_Hoffman_Capitol_Records_press_photo_2.jpg', year:1963, title:'The Beatles', fact:'Foto promocional de Capitol Records de Dezo Hoffmann.' },
      { file:'Yuri_Gagarin_with_awards_(cropped)_2.jpg', year:1961, title:'Yuri Gagarin', fact:'Primer humano en viajar al espacio, el 12 de abril de 1961.' },
      { file:'Neil_Armstrong_pose.jpg', year:1969, title:'Neil Armstrong', fact:'Primer ser humano en pisar la superficie de la Luna.' },
      { file:'Monroecirca1953.jpg', year:1953, title:'Marilyn Monroe', fact:'La icónica actriz en el apogeo de su carrera.' },
      { file:'AudreyKHepburn.jpg', year:1956, title:'Audrey Hepburn', fact:'Actriz británica símbolo de elegancia y estilo.' },
      { file:'Frida_Kahlo,_by_Guillermo_Kahlo.jpg', year:1932, title:'Frida Kahlo', fact:'Retrato tomado por su padre, el fotógrafo Guillermo Kahlo.' },
      { file:'Che_Guevara_-_Guerrillero_Heroico_by_Alberto_Korda.jpg', year:1960, title:'Che Guevara', fact:'"Guerrillero Heroico" de Alberto Korda, una de las fotos más reproducidas del siglo XX.' },
      { file:'Mother_Teresa_1.jpg', year:1986, title:'Madre Teresa', fact:'Religiosa albanesa, premio Nobel de la Paz en 1979.' },
      { file:'Margaret_Thatcher_stock_portrait_(2)_(cropped).jpg', year:1983, title:'Margaret Thatcher', fact:'"La Dama de Hierro", primera ministra británica.' },
      { file:'Official_Portrait_of_President_Reagan_1981.jpg', year:1981, title:'Ronald Reagan', fact:'Retrato oficial del 40º presidente de EEUU.' },
      { file:'Diana,_Princess_of_Wales_1997_(2).jpg', year:1997, title:'Diana de Gales', fact:'Foto del año de su muerte en accidente en París.' },
      { file:'Pablo_picasso_1.jpg', year:1962, title:'Pablo Picasso', fact:'El pintor andaluz, cofundador del cubismo, en su madurez.' }
    ],
    cine: [
      { file:'Metropolis_(German_three-sheet_poster).jpg', year:1927, title:'Metropolis', fact:'Cartel alemán de la obra maestra de Fritz Lang.' },
      { file:'Das_Cabinet_des_Dr._Caligari.JPG', year:1920, title:'El gabinete del Dr. Caligari', fact:'Pionera del expresionismo cinematográfico de Robert Wiene.' },
      { file:'Nosferatu_poster_(Albin_Grau,_1922)_1.jpg', year:1922, title:'Nosferatu', fact:'Cartel de Albin Grau para la adaptación no autorizada de Drácula de Murnau.' },
      { file:'Vintage_Potemkin.jpg', year:1925, title:'El acorazado Potemkin', fact:'Película muda de Eisenstein famosa por la secuencia de las escaleras de Odesa.' },
      { file:'The_Kid_(1921)_poster.jpg', year:1921, title:'The Kid', fact:'Primer largometraje de Charlie Chaplin, con Jackie Coogan.' },
      { file:'Le_Voyage_dans_la_lune.jpg', year:1902, title:'Viaje a la Luna', fact:'Cortometraje pionero de Georges Méliès, primera película de ciencia ficción.' },
      { file:'Intolerance_(film).jpg', year:1916, title:'Intolerancia', fact:'Drama épico de D.W. Griffith con cuatro historias paralelas.' },
      { file:'The_General_(1926)_-_Movie_Poster_2.png', year:1926, title:'The General', fact:'Comedia muda dirigida y protagonizada por Buster Keaton.' },
      { file:'Sherlock_jr_poster.jpg', year:1924, title:'Sherlock Jr.', fact:'Comedia de Buster Keaton con efectos especiales pioneros.' },
      { file:'Gold_rush_poster.jpg', year:1925, title:'La quimera del oro', fact:'Charlie Chaplin como vagabundo en el Klondike.' },
      { file:'CasablancaPoster-Gold.jpg', year:1942, title:'Casablanca', fact:'Película de Michael Curtiz con Bogart y Bergman.' },
      { file:'Poster_-_Gone_With_the_Wind_01.jpg', year:1939, title:'Lo que el viento se llevó', fact:'Épica romántica de la guerra civil estadounidense.' },
      { file:'Citizen_Kane_poster,_1941_(Style_B,_unrestored).jpg', year:1941, title:'Ciudadano Kane', fact:'Obra maestra de Orson Welles, considerada la mejor película de la historia.' },
      { file:'Psycho_(1960)_theatrical_poster_(retouched).jpg', year:1960, title:'Psicosis', fact:'Thriller de Alfred Hitchcock con la famosa escena de la ducha.' },
      { file:'Godfather_ver1.jpg', year:1972, title:'El Padrino', fact:'Saga mafiosa de Francis Ford Coppola con Marlon Brando y Al Pacino.' },
      { file:'Jaws_movie_poster.jpg', year:1975, title:'Tiburón', fact:'El primer gran blockbuster veraniego, dirigido por Steven Spielberg.' },
      { file:'StarWarsMoviePoster1977.jpg', year:1977, title:'Star Wars: Una nueva esperanza', fact:'La galaxia muy muy lejana de George Lucas.' },
      { file:'Apocalypse_Now_poster.jpg', year:1979, title:'Apocalypse Now', fact:'Vietnam visto por Coppola, inspirada en El corazón de las tinieblas.' },
      { file:'E_t_the_extra_terrestrial_ver3.jpg', year:1982, title:'E.T. el Extraterrestre', fact:'El alien amigo de Spielberg que conmovió al mundo.' },
      { file:'The_Empire_Strikes_Back_(1980_film).jpg', year:1980, title:'El Imperio Contraataca', fact:'Episodio V, considerado el mejor de la saga original.' },
      { file:'Back_to_the_Future.jpg', year:1985, title:'Regreso al Futuro', fact:'Marty McFly viaja a 1955 en un DeLorean.' },
      { file:'Goodfellas.jpg', year:1990, title:'Uno de los Nuestros', fact:'Scorsese y la mafia italoamericana.' },
      { file:'Jurassic_Park_poster.jpg', year:1993, title:'Parque Jurásico', fact:'Dinosaurios resucitados por la magia de Spielberg.' },
      { file:'Pulp_Fiction_(1994)_poster.jpg', year:1994, title:'Pulp Fiction', fact:'Tarantino y sus historias entrelazadas, Palma de Oro en Cannes.' },
      { file:'Titanic_(1997_film)_poster.png', year:1997, title:'Titanic', fact:'Romance épico de James Cameron, 11 Óscars.' },
      { file:'Saving_Private_Ryan_poster.jpg', year:1998, title:'Salvar al soldado Ryan', fact:'Drama bélico de Spielberg con el desembarco de Normandía.' },
      { file:'The_Matrix.png', year:1999, title:'Matrix', fact:'Los Wachowski reescriben la ciencia ficción con bullet time.' },
      { file:'The_Dark_Knight_(2008_film).jpg', year:2008, title:'El Caballero Oscuro', fact:'Batman vs Joker de Christopher Nolan, con Heath Ledger.' },
      { file:'Avatar_(2009_film)_poster.jpg', year:2009, title:'Avatar', fact:'Pandora reinventa el cine 3D, mayor recaudación histórica.' },
      { file:'Inception_(2010)_theatrical_poster.jpg', year:2010, title:'Origen', fact:'Sueños dentro de sueños, otra obra mental de Nolan.' }
    ],
    ciudades: [
      { file:'Tour_Eiffel_Wikimedia_Commons_(cropped).jpg', year:2014, title:'Torre Eiffel', fact:'Construida para la Exposición Universal de 1889 por Gustave Eiffel.' },
      { file:'Front_view_of_Statue_of_Liberty_(cropped).jpg', year:2017, title:'Estatua de la Libertad', fact:'Regalo de Francia a EEUU inaugurado en 1886.' },
      { file:'Elizabeth_Tower,_June_2022.jpg', year:2022, title:'Elizabeth Tower (Big Ben)', fact:'Torre del reloj del Palacio de Westminster restaurada en 2022.' },
      { file:'Brandenburger_Tor_abends.jpg', year:2018, title:'Puerta de Brandeburgo', fact:'Monumento neoclásico de 1791, símbolo de Berlín reunificado.' },
      { file:'Colosseo_2020.jpg', year:2020, title:'Coliseo de Roma', fact:'Anfiteatro construido entre 70-80 d.C. bajo los emperadores Flavios.' },
      { file:'Sydney_Australia._(21339175489).jpg', year:2015, title:'Ópera de Sídney', fact:'Diseñada por Jørn Utzon e inaugurada en 1973.' },
      { file:'Tokyo_Tower_2023.jpg', year:2023, title:'Torre de Tokio', fact:'Inaugurada en 1958, inspirada en la Torre Eiffel.' },
      { file:'Burj_Khalifa_(worlds_tallest_building)_and_the_Dubai_skyline_(25781049892).jpg', year:2016, title:'Burj Khalifa', fact:'El edificio más alto del mundo (828 m), inaugurado en Dubái en 2010.' },
      { file:'1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg', year:2023, title:'Acrópolis de Atenas', fact:'Conjunto monumental del siglo V a.C., con el Partenón como joya.' },
      { file:'Brooklyn_Bridge_Manhattan.jpg', year:2010, title:'Puente de Brooklyn', fact:'Vista moderna del puente histórico de Nueva York.' },
      { file:'Empire_State_Building_(aerial_view).jpg', year:2015, title:'Empire State Building', fact:'Vista aérea del rascacielos art déco de 1931.' },
      { file:'Tower_Bridge_at_Dawn.jpg', year:2015, title:'Tower Bridge', fact:'El icónico puente basculante del Támesis al amanecer.' },
      { file:'Notre-Dame_de_Paris,_4_October_2017.jpg', year:2017, title:'Notre-Dame de París', fact:'La catedral antes del incendio de abril de 2019.' },
      { file:'Louvre_Museum_Wikimedia_Commons.jpg', year:2014, title:'Museo del Louvre', fact:'Pirámide de Pei en el patio principal del palacio.' },
      { file:'Arc_de_Triomphe,_Paris_21_October_2010.jpg', year:2010, title:'Arco del Triunfo', fact:'Monumento napoleónico encargado en 1806 en la place de l\'Étoile.' },
      { file:'Madrid_Plaza_Mayor_(48733706273).jpg', year:2019, title:'Plaza Mayor de Madrid', fact:'Iniciada en 1617 bajo Felipe III, corazón del Madrid de los Austrias.' },
      { file:'Christ_the_Redeemer_-_Cristo_Redentor.jpg', year:2015, title:'Cristo Redentor', fact:'Estatua art déco de 38 m sobre el Corcovado en Río de Janeiro.' },
      { file:'The_Great_Wall_of_China_at_Jinshanling-edit.jpg', year:2008, title:'Gran Muralla China', fact:'Sección de Jinshanling, una de las mejor conservadas.' },
      { file:'The_Forbidden_City_-_View_from_Coal_Hill.jpg', year:2014, title:'Ciudad Prohibida', fact:'Palacio imperial chino, residencia de emperadores Ming y Qing.' },
      { file:'Al_Deir_Petra.JPG', year:2010, title:'Petra (El Monasterio)', fact:'Antigua ciudad nabatea esculpida en la roca rosa de Jordania.' },
      { file:'Pyramids_of_the_Giza_Necropolis.jpg', year:2010, title:'Pirámides de Giza', fact:'Las tres pirámides faraónicas con la Esfinge.' },
      { file:'Hagia_Sophia_(228968325).jpeg', year:2015, title:'Santa Sofía', fact:'Antigua catedral bizantina del año 537, hoy mezquita en Estambul.' },
      { file:'Sydney_Harbour_Bridge-16_October_2025.jpg', year:2025, title:'Sydney Harbour Bridge', fact:'Apodado "The Coathanger", inaugurado en 1932.' },
      { file:'Golden_Gate_Bridge_as_seen_from_Battery_East.jpg', year:2015, title:'Golden Gate Bridge', fact:'El puente colgante naranja de San Francisco, inaugurado en 1937.' },
      { file:'View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_(cropped).jpg', year:2018, title:'Manhattan desde Rockefeller', fact:'Vista clásica del skyline neoyorquino.' },
      { file:'Las_Vegas_Strip_09_2017_4897.jpg', year:2017, title:'Las Vegas Strip', fact:'La avenida principal del entretenimiento en el desierto de Nevada.' },
      { file:'Dubai_Marina_Skyline.jpg', year:2017, title:'Dubai Marina', fact:'Distrito artificial de rascacielos de lujo a orillas del Golfo.' },
      { file:'Shibuya_Crossing,_Aerial.jpg', year:2018, title:'Cruce de Shibuya', fact:'El paso de peatones más fotografiado del mundo, en Tokio.' },
      { file:'Cidade_Maravilhosa.jpg', year:2014, title:'Río de Janeiro', fact:'La "Cidade Maravilhosa" vista desde el Cristo Redentor.' }
    ],
    futbol: [
      { file:'1930_FIFA_World_Cup_Final_-_Argentina_v_Uruguay.jpg', year:1930, title:'Final del Mundial 1930', fact:'Uruguay venció 4-2 a Argentina en Montevideo.' },
      { file:'Pele_with_trophy.jpg', year:1970, title:'Pelé con la Jules Rimet', fact:'Brasil ganó por tercera vez y conservó la copa para siempre.' },
      { file:'Maradona_-_Argentinos_Juniors_(1980).jpg', year:1980, title:'Maradona en Argentinos Juniors', fact:'Diego brilló en Argentinos antes de fichar por Boca.' },
      { file:'Wembley_Stadium_2007.jpg', year:2007, title:'Estadio de Wembley', fact:'Reemplazó al estadio original demolido en 2003.' },
      { file:'Camp_Nou_-_Inside.jpg', year:2009, title:'Camp Nou', fact:'Estadio del FC Barcelona, uno de los más grandes de Europa.' },
      { file:'Cristiano_Ronaldo_2018.jpg', year:2018, title:'Cristiano Ronaldo', fact:'Cinco veces Balón de Oro, símbolo del fútbol moderno.' },
      { file:'Diego_Maradona_1986.jpg', year:1986, title:'Maradona en México 86', fact:'Conquistó el Mundial marcando "la mano de Dios" y el "gol del siglo".' },
      { file:'Estadio_Centenario.jpg', year:1930, title:'Estadio Centenario', fact:'Construido en Montevideo para el Mundial de 1930.' },
      { file:'Iniesta_lap_of_honour_Euro_2012.jpg', year:2012, title:'Iniesta en la Euro 2012', fact:'España conquistó su tercer gran torneo consecutivo.' },
      { file:'Bobby_Moore_England_Captain.jpg', year:1966, title:'Bobby Moore', fact:'Capitán de Inglaterra campeona del mundo en 1966.' },
      { file:'Lionel_Messi_White_House_2026_(3x4_cropped).jpg', year:2026, title:'Lionel Messi', fact:'En la Casa Blanca, era post-Inter Miami.' },
      { file:'President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_(54933344262)_(cropped_and_rotated).jpg', year:2025, title:'Cristiano Ronaldo en la Casa Blanca', fact:'Reunión con Trump en el Despacho Oval.' },
      { file:'Neymar_Jr._with_Al_Hilal,_3_October_2023_-_03_(cropped).jpg', year:2023, title:'Neymar en Al Hilal', fact:'Su etapa en el fútbol saudí tras dejar el PSG.' },
      { file:'Argentina_celebrando_copa_(cropped).jpg', year:1986, title:'Argentina campeona México 86', fact:'Maradona y compañeros celebrando con la Copa del Mundo.' },
      { file:'Johan_Cruijff_(1974).jpg', year:1974, title:'Johan Cruyff', fact:'El astro neerlandés en el Mundial de Alemania.' },
      { file:'Zinedine_Zidane_by_Tasnim_03.jpg', year:2018, title:'Zinedine Zidane', fact:'Como entrenador del Real Madrid tras tres Champions seguidas.' },
      { file:'Ronaldinho_in_2019.jpg', year:2019, title:'Ronaldinho', fact:'La sonrisa eterna del brasileño tras su retirada.' },
      { file:'Ronaldo_Luís_Nazário_de_Lima_2019_(3x4_cropped).jpg', year:2019, title:'Ronaldo Nazário', fact:'El "Fenómeno" brasileño, doble Mundial y doble Pichichi.' },
      { file:'Sergio_Ramos_Interview_2021_(cropped).jpg', year:2021, title:'Sergio Ramos', fact:'El capitán histórico del Real Madrid en su último año en el club.' },
      { file:'Iker-Casillas-SportsTrade-2021-cropped.jpg', year:2021, title:'Iker Casillas', fact:'"San Iker", portero campeón del Mundial 2010 con España.' },
      { file:'20150616_-_Portugal_-_Italie_-_Genève_-_Andrea_Pirlo_(cropped).jpg', year:2015, title:'Andrea Pirlo', fact:'El elegante volante italiano, campeón del Mundial 2006.' },
      { file:'David_Beckham_UNICEF_(cropped2).jpg', year:2018, title:'David Beckham', fact:'Embajador de UNICEF tras una carrera en Manchester United, Real Madrid y otros.' },
      { file:'Frank_Lampard_2019.jpg', year:2019, title:'Frank Lampard', fact:'Leyenda del Chelsea como entrenador del propio club.' },
      { file:'2019147183134_2019-05-27_Fussball_1.FC_Kaiserslautern_vs_FC_Bayern_München_-_Sven_-_1D_X_MK_II_-_0228_-_B70I8527_(cropped).jpg', year:2019, title:'Robert Lewandowski', fact:'El goleador polaco del Bayern de Múnich.' },
      { file:'Erling_Haaland_June_2025.jpg', year:2025, title:'Erling Haaland', fact:'La máquina goleadora noruega del Manchester City.' },
      { file:'Mohamed_Salah_2018.jpg', year:2018, title:'Mohamed Salah', fact:'El faraón egipcio del Liverpool, Bota de Oro 2018 y 2019.' },
      { file:'Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_(cropped).jpg', year:2026, title:'Kevin De Bruyne', fact:'Precisión y asistencias belgas en cada balón.' },
      { file:'Franz_Beckenbauer_(1975).jpg', year:1975, title:'Franz Beckenbauer', fact:'"Der Kaiser", capitán de Alemania campeona del Mundial 1974.' },
      { file:'Michel_Platini_2010_(cropped).jpg', year:2010, title:'Michel Platini', fact:'Triple Balón de Oro consecutivo (1983-85), capitán de Francia.' },
      { file:'George_best_1976.jpg', year:1976, title:'George Best', fact:'Genio norirlandés del Manchester United, Balón de Oro 1968.' }
    ],
    videojuegos: [
      { file:'Atari-2600-Wood-4Sw-Set.png', year:1977, title:'Atari 2600', fact:'Popularizó los cartuchos intercambiables en consolas domésticas.' },
      { file:'NES-Console-Set.png', year:1985, title:'Nintendo Entertainment System', fact:'Rescató la industria tras el crack de 1983.' },
      { file:'Game-Boy-FL.png', year:1989, title:'Game Boy', fact:'La portátil de Nintendo vendió más de 118 millones de unidades.' },
      { file:'SNES-Mod1-Console-Set.png', year:1990, title:'Super Nintendo', fact:'Sucesora de la NES con gráficos de 16 bits.' },
      { file:'Sega-Mega-Drive-JP-Mk1-Console-Set.jpg', year:1988, title:'Sega Mega Drive', fact:'Compitió ferozmente con la SNES en la "guerra de consolas".' },
      { file:'PSX-Console-wController.png', year:1994, title:'Sony PlayStation', fact:'Revolucionó el mercado con CDs y gráficos 3D.' },
      { file:'Nintendo-64-Console-Set.png', year:1996, title:'Nintendo 64', fact:'Consola de 64 bits con cartuchos y el controlador trident.' },
      { file:'PS2-Console-Set.png', year:2000, title:'PlayStation 2', fact:'La consola más vendida de la historia.' },
      { file:'Xbox-Console-Set.png', year:2001, title:'Xbox', fact:'Primera consola doméstica de Microsoft.' },
      { file:'Wii-Console-Set.png', year:2006, title:'Nintendo Wii', fact:'Revolucionó el control de movimiento con sus mandos.' },
      { file:'Nintendo-Switch-Console-Docked-wJoyCons.png', year:2017, title:'Nintendo Switch', fact:'Híbrido entre consola doméstica y portátil.' },
      { file:'PS4-Console-wDualShock4.png', year:2013, title:'PlayStation 4', fact:'Más de 117 millones de unidades vendidas.' },
      { file:'Xbox-360-S-Console-Set.png', year:2010, title:'Xbox 360 S', fact:'Versión rediseñada de la Xbox 360, más fina y silenciosa.' },
      { file:'PS2-Versions.png', year:2000, title:'PlayStation 2 (versiones)', fact:'Las distintas revisiones de la consola más vendida de la historia.' },
      { file:'Xbox-Console-wDuke-L.jpg', year:2001, title:'Xbox con mando Duke', fact:'La primera Xbox y su famoso mando enorme apodado "The Duke".' },
      { file:'PS3_consoles_montage.png', year:2006, title:'PlayStation 3', fact:'Familia de modelos: Fat, Slim y Super Slim.' },
      { file:'GameCube-Console-Set.png', year:2001, title:'Nintendo GameCube', fact:'El cubo morado de Nintendo, con mini-DVDs como soporte.' },
      { file:'Nintendo-3DS-AquaOpen.png', year:2011, title:'Nintendo 3DS', fact:'Portátil con efecto 3D estereoscópico sin gafas.' },
      { file:'PlayStation-Vita-1101-FL.png', year:2011, title:'PlayStation Vita', fact:'Sucesora de la PSP con doble joystick y panel táctil trasero.' },
      { file:'Black_and_white_Playstation_5_base_edition_with_controller.png', year:2020, title:'PlayStation 5', fact:'Novena generación de Sony con SSD ultrarrápido.' },
      { file:'Steam_Deck_(front).png', year:2022, title:'Steam Deck', fact:'PC portátil de Valve para jugar al catálogo de Steam.' },
      { file:'Sega-Game-Gear-WB.png', year:1990, title:'Sega Game Gear', fact:'La portátil a color de Sega, rival de la Game Boy.' },
      { file:'TurboGrafx16-Console-Set.jpg', year:1987, title:'TurboGrafx-16', fact:'La PC Engine de NEC en Norteamérica.' },
      { file:'Neo-Geo-AES-Console-Set.png', year:1990, title:'Neo Geo AES', fact:'La consola arcade-en-casa de SNK, prohibitivamente cara.' },
      { file:'ColecoVision-wController-L.jpg', year:1982, title:'ColecoVision', fact:'Competidora directa de la Atari 2600 con mejores gráficos.' },
      { file:'Sega-Master-System-Set.jpg', year:1985, title:'Sega Master System', fact:'La primera respuesta de Sega a Nintendo, popular en Brasil y Europa.' },
      { file:'Nintendo-Game-Boy-Advance-Purple-FL.png', year:2001, title:'Game Boy Advance', fact:'La portátil de 32 bits de Nintendo, sucesora de la Game Boy Color.' },
      { file:'Nintendo-DS-Fat-Blue.png', year:2004, title:'Nintendo DS', fact:'La revolucionaria portátil de doble pantalla con táctil.' },
      { file:'PSP-1000.png', year:2004, title:'PlayStation Portable (PSP)', fact:'La portátil de Sony con discos UMD y pantalla widescreen.' },
      { file:'Sega-CD-Model1-Set.jpg', year:1992, title:'Sega CD / Mega CD', fact:'Expansión de la Mega Drive para juegos en CD-ROM.' },
      { file:'Air_Force_officer_using_Valve_Index.jpg', year:2019, title:'Valve Index', fact:'Cascos de realidad virtual PC de Valve, top de gama.' },
      { file:'Magnavox-Odyssey-Console-Set.jpg', year:1972, title:'Magnavox Odyssey', fact:'La primera consola de videojuegos doméstica de la historia.' },
      { file:'Atari-Lynx-I-Handheld.jpg', year:1989, title:'Atari Lynx', fact:'Primera portátil con pantalla LCD a color, frente a la Game Boy monocroma.' }
    ]
  }; void _UNUSED_INLINE_FALLBACK;
  const FALLBACK_IMAGES = FALLBACK_IMAGES_RAW;

  /* ----------------------------- STATE ----------------------------------- */
  const state = {
    selectedCategory: 'historia',
    timerMode: false,
    game: null,
    timer: null,
    rankingFilter: 'all',
    rankingMode: 'normal',
    introScene: null,
    homeScene: null,
    dial: null
  };

  /* ----------------------------- DOM HELPERS ----------------------------- */
  const $ = (id) => document.getElementById(id);

  function toast(msg, ms = 2200) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('visible'), ms);
  }

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === name));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ----------------------------- AUDIO ----------------------------------- */
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function beep(freq, dur, type='sine', vol=0.18) {
    const ctx = ensureAudio(); if (!ctx) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + dur + 0.05);
  }
  function sfxTick()    { beep(880, 0.03, 'square', 0.05); }
  function sfxClick()   { beep(420, 0.04, 'square', 0.08); }
  function sfxStamp()   { beep(80, 0.18, 'sawtooth', 0.22); setTimeout(()=>beep(120, 0.1, 'square', 0.14), 50); }
  function sfxCorrect() { beep(660, 0.12, 'sine', 0.2); setTimeout(()=>beep(990, 0.18, 'sine', 0.18), 110); }
  function sfxClose()   { beep(520, 0.12, 'sine', 0.16); setTimeout(()=>beep(660, 0.14, 'sine', 0.14), 110); }
  function sfxWrong()   { beep(220, 0.22, 'sawtooth', 0.16); }
  function sfxFinal()   { [523, 659, 784, 1047].forEach((f, i) => setTimeout(()=>beep(f, 0.18, 'triangle', 0.18), i * 130)); }
  function sfxTimeout() { beep(180, 0.4, 'sawtooth', 0.18); }
  function sfxWhoosh()  {
    const ctx = ensureAudio(); if (!ctx) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.55);
  }

  /* =========================================================================
     INTRO 3D SCENE — Vintage Pocket Watch
     ========================================================================= */
  function createIntroScene(canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x040302, 6, 22);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.outputColorSpace !== undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }

    // Warm museum lighting
    scene.add(new THREE.AmbientLight(0x3a2a18, 0.55));
    const keyLight = new THREE.DirectionalLight(0xfff0c0, 1.9);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x4fc3f7, 0.65);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);
    const goldGlow = new THREE.PointLight(0xf5c518, 2.6, 8);
    goldGlow.position.set(0, 0, 1.8);
    scene.add(goldGlow);

    /* ===== Clock face texture (Roman numerals + brand) ===== */
    const fc = document.createElement('canvas');
    fc.width = 1024; fc.height = 1024;
    const fx = fc.getContext('2d');

    const faceGrad = fx.createRadialGradient(512, 512, 100, 512, 512, 510);
    faceGrad.addColorStop(0, '#f7ecd0');
    faceGrad.addColorStop(0.55, '#ead9b3');
    faceGrad.addColorStop(1, '#b89860');
    fx.fillStyle = faceGrad;
    fx.beginPath();
    fx.arc(512, 512, 510, 0, Math.PI * 2);
    fx.fill();

    for (let i = 0; i < 4500; i++) {
      fx.fillStyle = `rgba(120, 90, 50, ${Math.random() * 0.18})`;
      fx.fillRect(Math.random()*1024, Math.random()*1024, 1, 1);
    }
    fx.strokeStyle = 'rgba(58, 40, 24, 0.35)';
    fx.lineWidth = 1;
    [485, 465, 360].forEach(r => {
      fx.beginPath(); fx.arc(512, 512, r, 0, Math.PI * 2); fx.stroke();
    });

    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isHour = i % 5 === 0;
      const r1 = isHour ? 440 : 458;
      const r2 = 475;
      fx.strokeStyle = '#1a1612';
      fx.lineWidth = isHour ? 6 : 2;
      fx.beginPath();
      fx.moveTo(512 + Math.cos(a) * r1, 512 + Math.sin(a) * r1);
      fx.lineTo(512 + Math.cos(a) * r2, 512 + Math.sin(a) * r2);
      fx.stroke();
    }

    const numerals = ['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];
    fx.fillStyle = '#1a1612';
    fx.textAlign = 'center';
    fx.textBaseline = 'middle';
    fx.font = 'bold 78px "Bebas Neue", serif';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      fx.fillText(numerals[i], 512 + Math.cos(a) * 395, 512 + Math.sin(a) * 395);
    }

    fx.font = 'bold 32px "Special Elite", monospace';
    fx.fillStyle = '#1a1612';
    fx.fillText('RETROGUESSER', 512, 295);
    fx.font = '15px "DM Mono", monospace';
    fx.fillStyle = '#5a3e1a';
    fx.fillText('— TIME ARCHIVE —', 512, 322);

    fx.beginPath();
    fx.arc(512, 695, 58, 0, Math.PI * 2);
    fx.strokeStyle = '#1a1612';
    fx.lineWidth = 2;
    fx.stroke();
    fx.font = 'bold 22px "Bebas Neue", serif';
    fx.fillStyle = '#1a1612';
    fx.fillText('1900', 512, 681);
    fx.font = '12px "DM Mono", monospace';
    fx.fillStyle = '#5a3e1a';
    fx.fillText('— vs —', 512, 698);
    fx.font = 'bold 22px "Bebas Neue", serif';
    fx.fillStyle = '#1a1612';
    fx.fillText('2024', 512, 716);

    const faceTex = new THREE.CanvasTexture(fc);
    faceTex.anisotropy = 8;

    const clock = new THREE.Group();
    const R = 1.5;

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a14c, metalness: 0.95, roughness: 0.18,
      emissive: 0x4a3010, emissiveIntensity: 0.4
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518, metalness: 1, roughness: 0.2,
      emissive: 0x553300, emissiveIntensity: 0.5
    });

    const bezel = new THREE.Mesh(new THREE.TorusGeometry(R, 0.14, 32, 96), brassMat);
    clock.add(bezel);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(R - 0.12, 0.025, 16, 96), goldMat);
    clock.add(innerRing);

    const face = new THREE.Mesh(
      new THREE.CircleGeometry(R - 0.1, 64),
      new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.6, metalness: 0.08 })
    );
    face.position.z = -0.02;
    clock.add(face);

    const side = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R, 0.2, 96, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xb88838, metalness: 0.9, roughness: 0.32 })
    );
    side.rotation.x = Math.PI / 2;
    side.position.z = -0.1;
    clock.add(side);

    const back = new THREE.Mesh(
      new THREE.CircleGeometry(R, 64),
      new THREE.MeshStandardMaterial({ color: 0x3a2818, roughness: 0.7, metalness: 0.3 })
    );
    back.position.z = -0.2;
    back.rotation.y = Math.PI;
    clock.add(back);

    function makeHand(length, baseW, color, z, withTail) {
      const hw = baseW / 2;
      const shape = new THREE.Shape();
      shape.moveTo(-hw, -0.05);
      shape.lineTo(-hw * 0.45, length * 0.85);
      shape.lineTo(0, length);
      shape.lineTo(hw * 0.45, length * 0.85);
      shape.lineTo(hw, -0.05);
      if (withTail) {
        shape.lineTo(hw * 0.6, -length * 0.22);
        shape.lineTo(-hw * 0.6, -length * 0.22);
      }
      shape.lineTo(-hw, -0.05);
      const mat = new THREE.MeshStandardMaterial({
        color: color, metalness: 0.75, roughness: 0.28,
        emissive: color, emissiveIntensity: 0.18
      });
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat);
      mesh.position.z = z;
      return mesh;
    }
    const hourHand = makeHand(0.68, 0.1,  0x1a1612, 0.04, false);
    const minHand  = makeHand(0.98, 0.07, 0x1a1612, 0.06, false);
    const secHand  = makeHand(1.15, 0.025,0xb73e3e, 0.08, true);
    clock.add(hourHand, minHand, secHand);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), goldMat);
    cap.position.z = 0.1;
    clock.add(cap);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 24), brassMat);
    crown.position.set(0, R + 0.07, 0);
    clock.add(crown);
    for (let i = 0; i < 8; i++) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, 0.13), brassMat);
      ridge.position.copy(crown.position);
      ridge.rotation.z = (i / 8) * Math.PI;
      clock.add(ridge);
    }
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 14, 36), brassMat);
    bow.position.set(0, R + 0.22, 0);
    clock.add(bow);

    const sc = document.createElement('canvas');
    sc.width = sc.height = 512;
    const sx = sc.getContext('2d');
    const sg = sx.createLinearGradient(0, 0, 512, 512);
    sg.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    sg.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)');
    sg.addColorStop(1, 'rgba(255, 255, 255, 0)');
    sx.fillStyle = sg;
    sx.beginPath(); sx.arc(256, 256, 255, 0, Math.PI * 2); sx.fill();
    const shineTex = new THREE.CanvasTexture(sc);
    const shine = new THREE.Mesh(
      new THREE.CircleGeometry(R - 0.1, 64),
      new THREE.MeshBasicMaterial({
        map: shineTex, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    shine.position.z = 0.12;
    clock.add(shine);

    const hc = document.createElement('canvas');
    hc.width = hc.height = 512;
    const hcx = hc.getContext('2d');
    const hg = hcx.createRadialGradient(256, 256, 0, 256, 256, 256);
    hg.addColorStop(0, 'rgba(245, 197, 24, 0.55)');
    hg.addColorStop(0.45, 'rgba(245, 197, 24, 0.18)');
    hg.addColorStop(1, 'rgba(245, 197, 24, 0)');
    hcx.fillStyle = hg;
    hcx.fillRect(0, 0, 512, 512);
    const haloTex = new THREE.CanvasTexture(hc);
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 5.5),
      new THREE.MeshBasicMaterial({
        map: haloTex, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    halo.position.z = -0.6;
    clock.add(halo);

    scene.add(clock);

    const pCount = 220;
    const pPos = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const r = 2.5 + Math.random() * 4;
      const a = Math.random() * Math.PI * 2;
      pPos[i*3]   = Math.cos(a) * r;
      pPos[i*3+1] = (Math.random() - 0.5) * 8;
      pPos[i*3+2] = Math.sin(a) * r;
      pVel[i] = 0.1 + Math.random() * 0.4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf5c518, size: 0.025, transparent: true,
      opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ===== Mouse interactivity =====
       Each hand smoothly tracks the cursor's angle (around the center of the
       canvas) with its own inertia — hour heavy/slow, minute medium, second
       quick. The clock body also tilts subtly toward the cursor (parallax).
    */
    let mouseAngle = -Math.PI / 2; // start with hands pointing up (12)
    let mouseNX = 0;
    let mouseNY = 0;
    function onIntroPointer(e) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      mouseAngle = -Math.atan2(dy, dx) - Math.PI / 2;
      mouseNX = dx / rect.width;
      mouseNY = dy / rect.height;
    }
    window.addEventListener('pointermove', onIntroPointer);

    function shortAngleDiff(from, to) {
      let d = (to - from) % (Math.PI * 2);
      if (d > Math.PI)  d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      return d;
    }

    let running = true;
    let speedMul = 1;
    let dissolving = false;
    const clockT = new THREE.Clock();
    function animate() {
      if (!running) return;
      const t = clockT.getElapsedTime();

      // Subtle float on Y + mouse-driven parallax tilt
      clock.position.y = Math.sin(t * 0.6) * 0.08;
      const targetTiltY = mouseNX * 0.45;
      const targetTiltX = mouseNY * 0.25;
      clock.rotation.y += (targetTiltY - clock.rotation.y) * 0.06;
      clock.rotation.x += (targetTiltX - clock.rotation.x) * 0.06;

      if (dissolving) {
        // Time-warp during dissolve
        secHand.rotation.z = -t * (Math.PI * 2 / 0.8) * speedMul;
        minHand.rotation.z = -t * (Math.PI * 2 / 2.4) * speedMul;
        hourHand.rotation.z = -t * (Math.PI * 2 / 6) * speedMul;
      } else {
        // Hands track the cursor with progressive inertia
        hourHand.rotation.z += shortAngleDiff(hourHand.rotation.z, mouseAngle) * 0.04;
        minHand.rotation.z  += shortAngleDiff(minHand.rotation.z,  mouseAngle) * 0.11;
        secHand.rotation.z  += shortAngleDiff(secHand.rotation.z,  mouseAngle) * 0.24;
      }

      halo.scale.setScalar(1 + Math.sin(t * 1.5) * 0.07);
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pos[i*3+1] += pVel[i] * 0.008;
        if (pos[i*3+1] > 4) pos[i*3+1] = -4;
      }
      pGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    function dissolve(onComplete) {
      sfxWhoosh();
      dissolving = true;
      gsap.to({ s: 1 }, {
        s: 18, duration: 0.7, ease: 'power3.in',
        onUpdate: function() { speedMul = this.targets()[0].s; }
      });
      const tl = gsap.timeline({ onComplete });
      tl.to(clock.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.45, ease: 'power2.in' }, 0)
        .to(clock.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.5, ease: 'power3.in' }, 0.45)
        .to(clock.rotation, { y: '+=8', z: '+=3', duration: 1, ease: 'power2.in' }, 0)
        .to(camera.position, { z: 13, duration: 1, ease: 'power3.in' }, 0)
        .to(particles.material, { size: 0.16, opacity: 1, duration: 0.4 }, 0)
        .to(particles.material, { opacity: 0, duration: 0.5 }, 0.55)
        .to(halo.scale, { x: 3.5, y: 3.5, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to(halo.material, { opacity: 0, duration: 0.4 }, 0.7);
      const flash = $('flashOverlay');
      gsap.fromTo(flash, { opacity: 0 }, { opacity: 0.9, duration: 0.15, delay: 0.5 });
      gsap.to(flash, { opacity: 0, duration: 0.6, delay: 0.65 });
      return tl;
    }

    return {
      stop() {
        running = false;
        window.removeEventListener('pointermove', onIntroPointer);
        window.removeEventListener('resize', resize);
        renderer.dispose && renderer.dispose();
      },
      dissolve, scene, camera, renderer
    };
  }

  /* =========================================================================
     HOME 3D SCENE — Futuristic Holographic Timeline Selector
     ========================================================================= */
  // Background colors for the Three.js home scene change between "navy space"
  // (default cyan theme) and "warm orange space" (timer-active theme).
  function getSceneBgTheme() {
    if (document.body.classList.contains('timer-active')) {
      return {
        fog: 0x180a05,
        bgTop: '#180a05', bgMid: '#0a0503', bgDeep: '#020100',
        bgUpperGlow: '#3a1808', bgHorizon: '#ff9842',
        cardBgTop: '#180a05', cardBgMid: '#0c0603', cardBgBot: '#060301'
      };
    }
    return {
      fog: 0x020410,
      bgTop: '#000510', bgMid: '#020a1a', bgDeep: '#0a1840',
      bgUpperGlow: '#082240', bgHorizon: '#4fc3f7',
      cardBgTop: '#020a18', cardBgMid: '#05101c', cardBgBot: '#000408'
    };
  }

  function getAccentHex() {
    const v = (getComputedStyle(document.body).getPropertyValue('--accent') || '').trim();
    if (v.startsWith('#')) {
      let h = v.slice(1);
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      const n = parseInt(h, 16);
      if (!isNaN(n)) return n;
    }
    return 0x4fc3f7;
  }

  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function createHomeScene(canvas, onSelect) {
    const sceneTheme = getSceneBgTheme();
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(sceneTheme.fog, 7, 28);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 80);
    camera.position.set(0, 1.5, 7.5);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.outputColorSpace !== undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
    }

    scene.add(new THREE.AmbientLight(0x223a55, 0.6));
    const keyL = new THREE.DirectionalLight(0x88ddff, 0.7);
    keyL.position.set(2, 4, 3);
    scene.add(keyL);
    const ACCENT_HEX = getAccentHex();
    const accentL = new THREE.PointLight(ACCENT_HEX, 2, 12);
    accentL.position.set(0, 2, 3);
    scene.add(accentL);
    const accentR = new THREE.PointLight(0xf5c518, 1.5, 12);
    accentR.position.set(3, 0, 2);
    scene.add(accentR);
    const accentL2 = new THREE.PointLight(0xb14fff, 1.2, 12);
    accentL2.position.set(-3, 0, 2);
    scene.add(accentL2);

    const gridSize = 60;
    const gridMain = new THREE.GridHelper(gridSize, 60, ACCENT_HEX, 0x143046);
    gridMain.position.y = -1.5;
    gridMain.material.transparent = true;
    gridMain.material.opacity = 0.45;
    scene.add(gridMain);
    const gridSub = new THREE.GridHelper(gridSize, 12, ACCENT_HEX, ACCENT_HEX);
    gridSub.position.y = -1.5;
    gridSub.material.transparent = true;
    gridSub.material.opacity = 0.18;
    scene.add(gridSub);

    // Two pre-built background planes (cyan + orange) stacked at the same
     //depth. We crossfade their opacities when the accent toggle flips, so
     //the deep-space background animates smoothly with the rest of the theme.
    function buildBgTexture(theme) {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 1024;
      const cx = c.getContext('2d');
      const g = cx.createLinearGradient(0, 0, 0, 1024);
      g.addColorStop(0,    theme.bgTop);
      g.addColorStop(0.55, theme.bgMid);
      g.addColorStop(0.75, theme.bgUpperGlow);
      g.addColorStop(0.85, theme.bgHorizon);
      g.addColorStop(0.95, theme.bgHorizon);
      g.addColorStop(1,    theme.bgDeep);
      cx.fillStyle = g;
      cx.fillRect(0, 0, 2048, 1024);
      // Stars (shared seed-ish layout so cyan/orange planes line up visually)
      for (let i = 0; i < 400; i++) {
        const y = Math.random() * 720;
        cx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.55})`;
        cx.fillRect(Math.random() * 2048, y, 1 + (Math.random() > 0.95 ? 1 : 0), 1);
      }
      const h = cx.createRadialGradient(1024, 870, 0, 1024, 870, 700);
      h.addColorStop(0,   hexToRgba(theme.bgHorizon, 0.45));
      h.addColorStop(0.4, hexToRgba(theme.bgHorizon, 0.15));
      h.addColorStop(1,   hexToRgba(theme.bgHorizon, 0));
      cx.fillStyle = h;
      cx.fillRect(0, 600, 2048, 424);
      return new THREE.CanvasTexture(c);
    }
    const themeCyan = {
      fog: 0x020410, bgTop: '#000510', bgMid: '#020a1a', bgDeep: '#0a1840',
      bgUpperGlow: '#082240', bgHorizon: '#4fc3f7'
    };
    const themeOrange = {
      fog: 0x180a05, bgTop: '#180a05', bgMid: '#0a0503', bgDeep: '#020100',
      bgUpperGlow: '#3a1808', bgHorizon: '#ff9842'
    };
    const bgPlaneGeo = new THREE.PlaneGeometry(60, 30);
    const bgPlaneCyan = new THREE.Mesh(bgPlaneGeo, new THREE.MeshBasicMaterial({
      map: buildBgTexture(themeCyan), transparent: true, depthWrite: false,
      opacity: state.timerMode ? 0 : 1
    }));
    bgPlaneCyan.position.set(0, 4, -12);
    scene.add(bgPlaneCyan);
    const bgPlaneOrange = new THREE.Mesh(bgPlaneGeo, new THREE.MeshBasicMaterial({
      map: buildBgTexture(themeOrange), transparent: true, depthWrite: false,
      opacity: state.timerMode ? 1 : 0
    }));
    bgPlaneOrange.position.set(0, 4, -12.01); // tiny offset to prevent z-fighting
    scene.add(bgPlaneOrange);

    const cats = Object.values(CATEGORIES);
    const cards = [];
    // Tighter spacing when we have more than 5 cards so they still fit on screen
    const spacing = cats.length > 5 ? 1.55 : 1.85;
    const startX = -(cats.length - 1) * spacing / 2;
    cats.forEach((cat, i) => {
      const card = createCategoryCard(cat);
      card.position.x = startX + i * spacing;
      card.position.y = 0.4;
      card.rotation.y = -card.position.x * 0.05;
      card.userData.categoryId = cat.id;
      card.userData.basePos = card.position.clone();
      card.userData.baseRot = card.rotation.clone();
      cards.push(card);
      scene.add(card);
    });

    cards.forEach((c, i) => {
      const baseY = c.userData.basePos.y;
      c.position.y = baseY - 3;
      c.userData.halo.material.opacity = 0;
      c.userData.floating = false; // disabled during entrance tween
      gsap.to(c.position, {
        y: baseY, duration: 0.85, delay: 0.1 + i * 0.09, ease: 'power3.out',
        onComplete: () => { c.userData.floating = true; }
      });
      gsap.to(c.userData.halo.material, { opacity: 1, duration: 0.7, delay: 0.3 + i * 0.09 });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);
    let hovered = null;

    function setMouse(cx, cy) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;
    }
    function pick() {
      raycaster.setFromCamera(mouse, camera);
      // Test against hit-boxes only — larger and unambiguous
      const targets = cards.map(c => c.userData.hitBox).filter(Boolean);
      const hits = raycaster.intersectObjects(targets, false);
      if (!hits.length) return null;
      return hits[0].object.parent; // hit box's parent is the card group
    }
    function hoverIn(c) {
      c.userData.floating = false; // pause float while elevated
      gsap.killTweensOf(c.position);
      gsap.to(c.position, { z: c.userData.basePos.z + 0.7, y: c.userData.basePos.y + 0.25, duration: 0.45, ease: 'power3.out' });
      gsap.to(c.rotation, { y: c.userData.baseRot.y * 0.1, x: -0.06, duration: 0.45, ease: 'power3.out' });
      gsap.to(c.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.45, ease: 'back.out(2)' });
      gsap.to(c.userData.halo.scale, { x: 1.4, y: 1.4, duration: 0.5, ease: 'power2.out' });
      gsap.to(c.userData.halo.material, { opacity: 1, duration: 0.4 });
      if (c.userData.edgeMat) gsap.to(c.userData.edgeMat, { opacity: 1, duration: 0.4 });
      cards.forEach(o => {
        if (o !== c) gsap.to(o.userData.halo.material, { opacity: 0.4, duration: 0.4 });
      });
    }
    function hoverOut(c) {
      c.userData.floating = false; // pause float during return tween
      gsap.killTweensOf(c.position);
      gsap.to(c.position, {
        z: c.userData.basePos.z, y: c.userData.basePos.y,
        duration: 0.45, ease: 'power3.out',
        onComplete: () => { c.userData.floating = true; }
      });
      gsap.to(c.rotation, { y: c.userData.baseRot.y, x: 0, duration: 0.45, ease: 'power3.out' });
      gsap.to(c.scale, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'power3.out' });
      gsap.to(c.userData.halo.scale, { x: 1, y: 1, duration: 0.5, ease: 'power2.out' });
      gsap.to(c.userData.halo.material, { opacity: 1, duration: 0.4 });
      if (c.userData.edgeMat) gsap.to(c.userData.edgeMat, { opacity: 0.55, duration: 0.4 });
      cards.forEach(o => {
        if (o !== c) gsap.to(o.userData.halo.material, { opacity: 1, duration: 0.4 });
      });
    }

    canvas.addEventListener('pointermove', (e) => {
      setMouse(e.clientX, e.clientY);
      const c = pick();
      if (c !== hovered) {
        if (hovered) hoverOut(hovered);
        if (c) { hoverIn(c); sfxTick(); }
        hovered = c;
        canvas.style.cursor = c ? 'pointer' : 'default';
      }
    });
    canvas.addEventListener('pointerleave', () => {
      if (hovered) { hoverOut(hovered); hovered = null; }
    });
    canvas.addEventListener('click', (e) => {
      setMouse(e.clientX, e.clientY);
      const c = pick();
      if (!c) return;
      sfxStamp();
      const tl = gsap.timeline({ onComplete: () => onSelect(c.userData.categoryId) });
      cards.forEach(o => {
        if (o !== c) {
          tl.to(o.position, { y: '+=4', duration: 0.55, ease: 'power2.in' }, 0);
          o.traverse(ch => {
            if (ch.isMesh && ch.material) {
              const mats = Array.isArray(ch.material) ? ch.material : [ch.material];
              mats.forEach(m => { if (m.transparent !== undefined) { m.transparent = true; tl.to(m, { opacity: 0, duration: 0.5 }, 0); } });
            }
          });
        }
      });
      tl.to(c.position, { z: 4, y: 0.5, duration: 0.7, ease: 'power3.in' }, 0)
        .to(c.rotation, { y: '+=0.6', x: 0, duration: 0.7 }, 0)
        .to(c.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.7 }, 0)
        .to(camera.position, { z: 3.5, duration: 0.7, ease: 'power2.in' }, 0)
        .to($('flashOverlay'), { opacity: 0.7, duration: 0.2 }, 0.5)
        .to($('flashOverlay'), { opacity: 0, duration: 0.4 }, 0.7);
    });

    const partCount = 280;
    const partPos = new Float32Array(partCount * 3);
    const partVel = new Float32Array(partCount * 3);
    const partColors = new Float32Array(partCount * 3);
    const colorChoices = [
      [0.31, 0.76, 0.97],
      [0.96, 0.77, 0.09],
      [0.69, 0.31, 1.00],
    ];
    for (let i = 0; i < partCount; i++) {
      partPos[i*3]   = (Math.random() - 0.5) * 18;
      partPos[i*3+1] = (Math.random() - 0.5) * 8;
      partPos[i*3+2] = (Math.random() - 0.5) * 8 - 1;
      partVel[i*3]   = (Math.random() - 0.5) * 0.005;
      partVel[i*3+1] = 0.005 + Math.random() * 0.01;
      partVel[i*3+2] = (Math.random() - 0.5) * 0.003;
      const cc = colorChoices[Math.floor(Math.random() * 3)];
      partColors[i*3]   = cc[0];
      partColors[i*3+1] = cc[1];
      partColors[i*3+2] = cc[2];
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute('color', new THREE.BufferAttribute(partColors, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.045, transparent: true, opacity: 0.85,
      vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    const streakCount = 20;
    const streaks = [];
    for (let i = 0; i < streakCount; i++) {
      const geo = new THREE.PlaneGeometry(0.6, 0.015);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? ACCENT_HEX : 0xf5c518,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const s = new THREE.Mesh(geo, mat);
      s.position.set(
        (Math.random() - 0.5) * 30,
        -1.45 + Math.random() * 0.03,
        (Math.random() - 0.5) * 10 - 2
      );
      s.rotation.x = -Math.PI / 2;
      s.userData.speed = 0.04 + Math.random() * 0.08;
      streaks.push(s);
      scene.add(s);
    }

    let camTargetX = 0, camTargetY = 1.5;
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      camTargetX = nx * 0.4;
      camTargetY = 1.5 + ny * 0.18;
    });

    function resize() {
      // Fall back to window size when the home <section> is hidden
      // (canvas.clientWidth == 0) so resetCards still recomputes correctly.
      let w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) { w = window.innerWidth; h = window.innerHeight; }
      if (!w || !h) return;
      const aspect = w / h;
      const cardSpan = (cards.length - 1) * spacing + 1.4;
      camera.fov = aspect < 0.85 ? 62 : (aspect < 1.3 ? 54 : 46);
      camera.aspect = aspect;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);
      const requiredZ = (cardSpan / 2) / Math.tan(hFovRad / 2) + 1.0;
      camera.position.z = Math.max(7, requiredZ);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    window.addEventListener('resize', resize);

    let running = true;
    const tClock = new THREE.Clock();
    function animate() {
      if (!running) return;
      const t = tClock.getElapsedTime();

      cards.forEach((c, i) => {
        // Only apply gentle floating when card is idle (not hovered, not tweening)
        if (c.userData.floating && c !== hovered) {
          const baseY = c.userData.basePos.y;
          c.position.y = baseY + Math.sin(t * 0.8 + i * 0.7) * 0.08;
        }
        if (c.userData.scanLine) {
          c.userData.scanLine.position.y = (Math.sin(t * 0.4 + i) * 0.5) * 0.7;
        }
        if (c.userData.halo) {
          c.userData.halo.rotation.z = t * 0.05;
        }
      });

      camera.position.x += (camTargetX - camera.position.x) * 0.05;
      camera.position.y += (camTargetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0.3, 0);

      const pp = partGeo.attributes.position.array;
      for (let i = 0; i < partCount; i++) {
        pp[i*3]   += partVel[i*3];
        pp[i*3+1] += partVel[i*3+1];
        pp[i*3+2] += partVel[i*3+2];
        if (pp[i*3+1] > 4) { pp[i*3+1] = -4; pp[i*3] = (Math.random() - 0.5) * 18; }
      }
      partGeo.attributes.position.needsUpdate = true;

      streaks.forEach(s => {
        s.position.x += s.userData.speed;
        if (s.position.x > 16) s.position.x = -16;
      });

      gridSub.material.opacity = 0.16 + Math.sin(t * 1.2) * 0.08;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // Smoothly tween the scene's accent-coloured elements (lights, grids,
     //streaks, background + fog) to the current --accent CSS variable.
     //Cards + photos stay put; only the space behind them recolors.
    function updateAccent() {
      const target = new THREE.Color(getAccentHex());
      const tweenColor = (c) => gsap.to(c, {
        r: target.r, g: target.g, b: target.b,
        duration: 0.7, ease: 'power2.inOut'
      });
      tweenColor(accentL.color);
      tweenColor(gridMain.material.color);
      tweenColor(gridSub.material.color);
      streaks.forEach((s, i) => {
        if (i % 2 === 0) tweenColor(s.material.color);
      });
      // Crossfade the deep-space background (cyan plane ↔ orange plane)
      const toOrange = state.timerMode;
      gsap.to(bgPlaneCyan.material,   { opacity: toOrange ? 0 : 1, duration: 0.7, ease: 'power2.inOut' });
      gsap.to(bgPlaneOrange.material, { opacity: toOrange ? 1 : 0, duration: 0.7, ease: 'power2.inOut' });
      // Tween fog color to match
      const fogTarget = new THREE.Color(toOrange ? themeOrange.fog : themeCyan.fog);
      gsap.to(scene.fog.color, {
        r: fogTarget.r, g: fogTarget.g, b: fogTarget.b,
        duration: 0.7, ease: 'power2.inOut'
      });
    }

    function resetCards() {
      hovered = null;
      // Kill ALL pending tweens on relevant objects first
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(camera.rotation);
      cards.forEach(c => {
        gsap.killTweensOf(c.position);
        gsap.killTweensOf(c.rotation);
        gsap.killTweensOf(c.scale);
        c.traverse(ch => {
          if (ch.isMesh && ch.material) {
            const mats = Array.isArray(ch.material) ? ch.material : [ch.material];
            mats.forEach(m => gsap.killTweensOf(m));
          }
        });
        if (c.userData.halo) {
          gsap.killTweensOf(c.userData.halo.scale);
          gsap.killTweensOf(c.userData.halo.material);
        }
        if (c.userData.edgeMat) gsap.killTweensOf(c.userData.edgeMat);
      });

      // Reset camera explicitly to a safe default BEFORE resize tries to refine
      camera.position.set(0, 1.5, 8);
      camera.lookAt(0, 0.3, 0);
      camTargetX = 0;
      camTargetY = 1.5;

      // Snap every card back to its base state
      cards.forEach(c => {
        c.position.set(c.userData.basePos.x, c.userData.basePos.y, c.userData.basePos.z);
        c.rotation.set(c.userData.baseRot.x, c.userData.baseRot.y, c.userData.baseRot.z);
        c.scale.set(1, 1, 1);
        c.userData.floating = true;
        c.traverse(ch => {
          if (ch.isMesh && ch.material) {
            const mats = Array.isArray(ch.material) ? ch.material : [ch.material];
            mats.forEach(m => { if (m.opacity !== undefined) m.opacity = 1; });
          }
        });
        if (c.userData.halo) {
          c.userData.halo.scale.set(1, 1, 1);
          c.userData.halo.material.opacity = 1;
        }
        if (c.userData.edgeMat) c.userData.edgeMat.opacity = 0.55;
      });

      // Recompute final camera Z based on actual viewport
      resize();
    }

    return {
      stop() { running = false; renderer.dispose && renderer.dispose(); },
      reset: resetCards,
      updateAccent,
      scene, camera, renderer
    };
  }

  /* ===== Premium polaroid-style card =====
     White cream paper frame, themed photo area with colored glow + emoji,
     handwritten caption and date range, corner stamp. Floats over a neon
     halo + glowing platform for the sci-fi context.
  */
  function createCategoryCard(cat) {
    const group = new THREE.Group();
    const W = 1.15, H = 1.5, D = 0.05;

    const cc = document.createElement('canvas');
    cc.width = 540; cc.height = 700;
    const cx = cc.getContext('2d');

    /* Paper background (slight cream gradient + grain) */
    const paperGrad = cx.createLinearGradient(0, 0, 0, 700);
    paperGrad.addColorStop(0, '#fffaf0');
    paperGrad.addColorStop(0.6, '#faf2e2');
    paperGrad.addColorStop(1, '#efe2c8');
    cx.fillStyle = paperGrad;
    cx.fillRect(0, 0, 540, 700);
    // Subtle paper grain
    for (let i = 0; i < 2200; i++) {
      cx.fillStyle = `rgba(180, 150, 110, ${Math.random() * 0.08})`;
      cx.fillRect(Math.random() * 540, Math.random() * 700, 1, 1);
    }
    // Corner darkening for vignette
    const corner = cx.createRadialGradient(270, 350, 200, 270, 350, 420);
    corner.addColorStop(0, 'rgba(0,0,0,0)');
    corner.addColorStop(1, 'rgba(120, 90, 50, 0.1)');
    cx.fillStyle = corner;
    cx.fillRect(0, 0, 540, 700);

    /* Photo area: large square at top, with category-tinted "photo" inside */
    const photoX = 36, photoY = 36, photoW = 540 - 72, photoH = 460;

    // Photo background: dark gradient with the category color glow
    const photoBg = cx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
    const cardTheme = getSceneBgTheme();
    photoBg.addColorStop(0,    cardTheme.cardBgTop);
    photoBg.addColorStop(0.55, cardTheme.cardBgMid);
    photoBg.addColorStop(1,    cardTheme.cardBgBot);
    cx.fillStyle = photoBg;
    cx.fillRect(photoX, photoY, photoW, photoH);

    // Stars in the photo
    for (let i = 0; i < 70; i++) {
      cx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.55})`;
      cx.fillRect(
        photoX + Math.random() * photoW,
        photoY + Math.random() * photoH,
        Math.random() > 0.95 ? 2 : 1, 1
      );
    }

    // Color radial glow at center of photo
    const glowGrad = cx.createRadialGradient(
      photoX + photoW / 2, photoY + photoH / 2, 0,
      photoX + photoW / 2, photoY + photoH / 2, photoW / 1.6
    );
    glowGrad.addColorStop(0, hexToRgba(cat.color, 0.55));
    glowGrad.addColorStop(0.55, hexToRgba(cat.color, 0.12));
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = glowGrad;
    cx.fillRect(photoX, photoY, photoW, photoH);

    // Subtle scan lines for retro-futuristic vibe
    cx.globalAlpha = 0.05;
    cx.fillStyle = '#ffffff';
    for (let y = photoY; y < photoY + photoH; y += 3) {
      cx.fillRect(photoX, y, photoW, 1);
    }
    cx.globalAlpha = 1;

    // Large emoji centered (the "subject" of the photo)
    cx.font = '230px sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.shadowColor = hexToRgba(cat.color, 0.75);
    cx.shadowBlur = 32;
    cx.fillText(cat.emoji, photoX + photoW / 2, photoY + photoH / 2);
    cx.shadowBlur = 0;

    // Inner photo frame border + soft inner shadow at edges
    cx.strokeStyle = 'rgba(0,0,0,0.4)';
    cx.lineWidth = 1;
    cx.strokeRect(photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
    // Soft inner shadow
    const innerShadow = cx.createLinearGradient(photoX, photoY, photoX, photoY + 30);
    innerShadow.addColorStop(0, 'rgba(0,0,0,0.35)');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = innerShadow;
    cx.fillRect(photoX, photoY, photoW, 30);

    /* Bottom polaroid margin: handwritten name + year range */
    cx.save();
    cx.translate(270, 568);
    cx.rotate(-0.02);
    cx.font = '38px "Special Elite", monospace';
    cx.fillStyle = '#2a2520';
    cx.textAlign = 'center';
    cx.textBaseline = 'alphabetic';
    cx.fillText(cat.name, 0, 0);
    cx.restore();

    cx.font = '18px "DM Mono", monospace';
    cx.fillStyle = '#8a7560';
    cx.textAlign = 'center';
    cx.fillText(cat.yearMin + '   —   ' + cat.yearMax, 270, 608);

    // "ARCHIVE" stamp in corner (tilted, faded red ink)
    cx.save();
    cx.translate(465, 668);
    cx.rotate(-0.18);
    cx.strokeStyle = 'rgba(180, 60, 55, 0.55)';
    cx.lineWidth = 1.5;
    cx.strokeRect(-40, -14, 80, 28);
    cx.font = 'bold 11px "DM Mono", monospace';
    cx.fillStyle = 'rgba(180, 60, 55, 0.65)';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('ARCHIVE', 0, 0);
    cx.restore();

    // Tiny ID in opposite corner
    cx.font = '10px "DM Mono", monospace';
    cx.fillStyle = 'rgba(60, 50, 40, 0.45)';
    cx.textAlign = 'left';
    cx.fillText('PXL.' + cat.id.toUpperCase().slice(0, 4) + '/2026', 36, 678);

    const cardTex = new THREE.CanvasTexture(cc);
    cardTex.anisotropy = 8;

    /* Materials */
    const frontMat = new THREE.MeshStandardMaterial({
      map: cardTex, roughness: 0.85, metalness: 0, transparent: true
    });
    const sideMat = new THREE.MeshStandardMaterial({
      color: 0xfaf0d8, roughness: 0.92, metalness: 0, transparent: true
    });
    const backMat = new THREE.MeshStandardMaterial({
      color: 0xe8dcc0, roughness: 0.9, metalness: 0, transparent: true
    });
    const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
    const card = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), materials);
    group.add(card);

    /* Edge outline (thin neon line around card) — gives subtle sci-fi glow */
    const edgeColor = new THREE.Color(cat.color);
    const edgeMatLine = new THREE.LineBasicMaterial({
      color: edgeColor, transparent: true, opacity: 0.55
    });
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(W * 1.005, H * 1.005, D * 1.05)),
      edgeMatLine
    );
    group.add(edges);
    group.userData.edgeMat = edgeMatLine; // used by hoverIn (opacity bump)

    /* Hit-box for reliable raycasting */
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(W * 1.25, H * 1.12, D * 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    group.add(hitBox);
    group.userData.hitBox = hitBox;

    /* Halo behind card (category color glow) */
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = haloCanvas.height = 256;
    const hctx = haloCanvas.getContext('2d');
    const hg = hctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    hg.addColorStop(0, hexToRgba(cat.color, 0.95));
    hg.addColorStop(0.45, hexToRgba(cat.color, 0.28));
    hg.addColorStop(1, hexToRgba(cat.color, 0));
    hctx.fillStyle = hg;
    hctx.fillRect(0, 0, 256, 256);
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 2.4, H * 1.7),
      new THREE.MeshBasicMaterial({
        map: haloTex, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    halo.position.z = -0.22;
    group.add(halo);
    group.userData.halo = halo;

    /* Soft drop-shadow plane underneath (subtle "floating above surface" hint) */
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    const sg = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    sg.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    sg.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
    sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const dropShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 1.6, W * 0.6),
      new THREE.MeshBasicMaterial({
        map: shadowTex, transparent: true, opacity: 0.7,
        depthWrite: false
      })
    );
    dropShadow.rotation.x = -Math.PI / 2;
    dropShadow.position.y = -H / 2 - 0.08;
    group.add(dropShadow);

    // No scan line on the polaroid (the photo inside already has scan-line texture)
    group.userData.scanLine = null;

    return group;
  }

  /* =========================================================================
     WIKIMEDIA API
     ========================================================================= */
  const SESSION_CACHE = new Set();
  const API_BASE = 'https://commons.wikimedia.org/w/api.php';
  function apiUrl(params) {
    const u = new URL(API_BASE);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    u.searchParams.set('format', 'json');
    u.searchParams.set('origin', '*');
    return u.toString();
  }
  async function fetchJson(url, timeoutMs = 5000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
  function extractYear(imageinfo, cat) {
    if (!imageinfo || !imageinfo[0]) return null;
    const m = imageinfo[0].extmetadata || {};
    const candidates = [
      m.DateTimeOriginal && m.DateTimeOriginal.value,
      m.DateTime && m.DateTime.value,
      m.GPSDateStamp && m.GPSDateStamp.value,
      m.ImageDescription && m.ImageDescription.value
    ].filter(Boolean);
    for (const raw of candidates) {
      const txt = String(raw).replace(/<[^>]+>/g, ' ');
      const mm = txt.match(/\b(1[89]\d{2}|20[0-2]\d)\b/);
      if (mm) {
        const y = parseInt(mm[1], 10);
        if (y >= cat.yearMin && y <= cat.yearMax) return y;
      }
    }
    return null;
  }
  function extractFact(imageinfo) {
    if (!imageinfo || !imageinfo[0]) return '';
    const m = imageinfo[0].extmetadata || {};
    let d = (m.ImageDescription && m.ImageDescription.value) || (m.ObjectName && m.ObjectName.value) || '';
    d = String(d).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (d.length > 220) d = d.slice(0, 217) + '…';
    return d;
  }
  function extractTitle(imageinfo, fileTitle) {
    if (imageinfo && imageinfo[0]) {
      const m = imageinfo[0].extmetadata || {};
      const t = (m.ObjectName && m.ObjectName.value) || '';
      if (t) return String(t).replace(/<[^>]+>/g, ' ').trim().slice(0, 80);
    }
    return fileTitle.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ').slice(0, 80);
  }
  async function searchCategoryFiles(catTitle, limit = 30) {
    const url = apiUrl({ action:'query', list:'categorymembers', cmtitle:'Category:'+catTitle, cmtype:'file', cmlimit:limit });
    const d = await fetchJson(url);
    return (d.query && d.query.categorymembers) || [];
  }
  async function getImageInfo(titles) {
    const url = apiUrl({ action:'query', titles:titles.join('|'), prop:'imageinfo', iiprop:'url|extmetadata|size', iiurlwidth:900 });
    const d = await fetchJson(url);
    return (d.query && d.query.pages) || {};
  }
  async function fetchFromWikimedia(cat, need = 5, budgetMs = 7500) {
    const start = Date.now();
    const results = [];
    const list = [...cat.wikimediaCategories].sort(() => Math.random() - 0.5);
    for (const c of list) {
      if (results.length >= need || Date.now() - start > budgetMs) break;
      let members;
      try { members = await searchCategoryFiles(c, 40); } catch (e) { continue; }
      members = members
        .filter(m => /\.(jpe?g|png|gif|webp)$/i.test(m.title) && !SESSION_CACHE.has(m.title))
        .sort(() => Math.random() - 0.5)
        .slice(0, 14);
      if (!members.length) continue;
      let pages;
      try { pages = await getImageInfo(members.map(m => m.title)); } catch (e) { continue; }
      for (const id of Object.keys(pages)) {
        if (results.length >= need) break;
        const p = pages[id];
        if (!p || !p.imageinfo) continue;
        const y = extractYear(p.imageinfo, cat);
        if (!y) continue;
        const info = p.imageinfo[0];
        const url = info.thumburl || info.url;
        if (!url) continue;
        const title = extractTitle(p.imageinfo, p.title);
        const fact = extractFact(p.imageinfo) || `Imagen del archivo de Wikimedia Commons (${y}).`;
        const src = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`;
        SESSION_CACHE.add(p.title);
        results.push({ url, year: y, title, fact, source: src });
      }
    }
    return results;
  }

  /* ----------------------------- IMAGE PRELOAD --------------------------- */
  function preloadOne(url, timeoutMs = 2500) {
    return new Promise((res) => {
      const img = new Image();
      let done = false;
      const f = (ok) => { if (done) return; done = true; res(ok); };
      const t = setTimeout(() => f(false), timeoutMs);
      img.onload = () => { clearTimeout(t); f(true); };
      img.onerror = () => { clearTimeout(t); f(false); };
      img.src = url;
    });
  }
  // Preload all candidates IN PARALLEL. Resolve as soon as `need` succeed —
  // no need to wait for the slow/broken ones to time out.
  function pickLoadable(candidates, need) {
    return new Promise((resolve) => {
      if (!candidates.length) return resolve([]);
      const succeeded = [];
      let settled = 0;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        const ordered = succeeded.sort((a, b) => a.i - b.i).map(s => s.c);
        resolve(ordered.slice(0, need));
      };
      candidates.forEach((c, i) => {
        preloadOne(c.url).then(ok => {
          settled++;
          if (ok) succeeded.push({ c, i });
          if (succeeded.length >= need) finish();
          else if (settled === candidates.length) finish();
        });
      });
    });
  }

  /* ----------------------------- ROUNDS BUILDER -------------------------- */
  // Curated fallback list ONLY. Shuffled per game so variety is built in,
  // and we never depend on the unpredictable Wikimedia random search.
  async function buildRounds(catId) {
    const cat = CATEGORIES[catId];
    // Variado: pull random images from every other category
    let raw = [];
    if (cat && cat.isVariado) {
      Object.entries(FALLBACK_IMAGES).forEach(([k, arr]) => {
        if (!arr) return;
        arr.forEach(o => raw.push(o));
      });
    } else {
      raw = FALLBACK_IMAGES[catId] || [];
    }
    const pool = raw.map(o => ({
      url: FB(o.file), year: o.year, title: o.title, fact: o.fact,
      source: `https://commons.wikimedia.org/wiki/File:${o.file}`
    })).sort(() => Math.random() - 0.5);

    // Pre-load and filter out broken URLs (skips 404s, slow images)
    const rounds = await pickLoadable(pool, 10);

    // Safety net: if too many broke, top up with whatever remains so the game
    // always has 10 rounds even if some images fail to render
    let i = 0;
    while (rounds.length < 10 && i < pool.length) {
      if (!rounds.includes(pool[i])) rounds.push(pool[i]);
      i++;
    }
    return rounds.slice(0, 10);
  }

  /* ----------------------------- SCORING --------------------------------- */
  function scoreFromDelta(d) {
    if (d === 0) return 1000;
    if (d <= 1) return 900;
    if (d <= 3) return 700;
    if (d <= 10) return 400;
    if (d <= 20) return 100;
    return 0;
  }

  /* =========================================================================
     DIAL (year selector)
     ========================================================================= */
  function buildDial(min, max, initial) {
    const track = $('dialTrack');
    track.innerHTML = '';
    const tickW = 30;
    for (let y = min; y <= max; y++) {
      const t = document.createElement('div');
      t.className = 'dial-tick' + (y % 5 === 0 ? ' major' : '');
      const span = document.createElement('span');
      span.className = 'yr';
      span.textContent = y;
      t.appendChild(span);
      track.appendChild(t);
    }
    const ribbon = $('dialRibbon');
    let value = Math.round(initial);
    let pxOffset = -(value - min) * tickW;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let snapTween = null;

    function paint() {
      track.style.transform = `translateX(${pxOffset}px)`;
      $('dialYear').textContent = value;
    }
    paint();

    function applyOffset(px) {
      const minPx = -(max - min) * tickW;
      pxOffset = Math.max(minPx, Math.min(0, px));
      const yearFloat = -pxOffset / tickW + min;
      const yearInt = Math.max(min, Math.min(max, Math.round(yearFloat)));
      if (yearInt !== value) {
        value = yearInt;
        sfxTick();
      }
      paint();
    }

    function snapToValue() {
      if (snapTween) snapTween.kill();
      const target = -(value - min) * tickW;
      snapTween = gsap.to({ p: pxOffset }, {
        p: target,
        duration: 0.18,
        ease: 'power2.out',
        onUpdate: function () {
          pxOffset = this.targets()[0].p;
          track.style.transform = `translateX(${pxOffset}px)`;
        }
      });
    }

    function onDown(e) {
      dragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startOffset = pxOffset;
      if (snapTween) snapTween.kill();
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      applyOffset(startOffset + (x - startX));
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      snapToValue();
    }

    ribbon.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    ribbon.addEventListener('wheel', (e) => {
      e.preventDefault();
      const nv = Math.max(min, Math.min(max, value + Math.sign(e.deltaY)));
      if (nv !== value) { value = nv; sfxTick(); paint(); snapToValue(); }
    }, { passive: false });

    return {
      get value() { return value; },
      set value(v) {
        value = Math.max(min, Math.min(max, Math.round(v)));
        paint();
        snapToValue();
      },
      destroy() {
        ribbon.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        if (snapTween) snapTween.kill();
      }
    };
  }

  /* =========================================================================
     SCREEN ROUTING
     ========================================================================= */
  function setupIntro() {
    const canvas = $('introCanvas');
    state.introScene = createIntroScene(canvas);
    const intro = $('screen-intro');
    function start() {
      if (intro.classList.contains('busy')) return;
      intro.classList.add('busy');
      ensureAudio();
      state.introScene.dissolve(() => {
        showScreen('screen-home');
        if (!state.homeScene) setupHome();
        gsap.fromTo($('flashOverlay'), { opacity: 0.3 }, { opacity: 0, duration: 0.4 });
      });
    }
    intro.addEventListener('click', start);
    intro.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); }
    });
  }

  // Rebuilds the home Three.js scene so its hardcoded neon colors pick up
  // the current --accent CSS variable (cyan / orange) after a theme toggle.
  function rebuildHomeScene() {
    if (!state.homeScene) return;
    if (state.homeScene.stop) state.homeScene.stop();
    const oldCanvas = $('homeCanvas');
    const fresh = oldCanvas.cloneNode(false);
    oldCanvas.parentNode.replaceChild(fresh, oldCanvas);
    requestAnimationFrame(() => {
      state.homeScene = createHomeScene($('homeCanvas'), (catId) => {
        state.selectedCategory = catId;
        startGame();
      });
    });
  }

  function setupHome() {
    const canvas = $('homeCanvas');
    state.homeScene = createHomeScene(canvas, (catId) => {
      state.selectedCategory = catId;
      startGame();
    });
    const tog = $('timerToggle');
    const switchRow = tog.closest('.timer-switch') || tog;
    function setTimerMode(v) {
      state.timerMode = !!v;
      tog.classList.toggle('on', state.timerMode);
      tog.setAttribute('aria-pressed', String(state.timerMode));
      // Flip the whole accent palette (cyan ↔ orange) via a body class.
      // CSS transitions handle every coloured element on the page.
      document.body.classList.toggle('timer-active', state.timerMode);
      // The 3D scene tweens its accent-coloured lights, grids and streaks
      // in place — cards and photos stay visible the whole time.
      if (state.homeScene && state.homeScene.updateAccent) {
        state.homeScene.updateAccent();
      }
    }
    // Click anywhere on the row toggles — easier to hit than the small button
    switchRow.addEventListener('click', () => {
      setTimerMode(!state.timerMode);
      sfxClick();
    });
    switchRow.style.cursor = 'pointer';
    $('btnRanking').addEventListener('click', () => {
      sfxClick();
      renderRanking();
      showScreen('screen-ranking');
    });
    gsap.from('.home-header, .home-hint, .home-controls', {
      opacity: 0, y: 20, stagger: 0.15, duration: 0.8, delay: 0.3
    });
  }

  /* ----------------------------- GAME ------------------------------------ */
  async function startGame() {
    const catId = state.selectedCategory;
    const cat = CATEGORIES[catId];
    showScreen('screen-game');
    toast('CARGANDO · ' + cat.name.toUpperCase(), 1500);

    const rounds = await buildRounds(catId);
    if (!rounds || !rounds.length) {
      toast('No se pudo cargar el archivo');
      showScreen('screen-home');
      return;
    }
    while (rounds.length < 10) rounds.push(rounds[rounds.length % Math.max(1, rounds.length)]);

    state.game = { categoryId: catId, rounds, currentRound: 0, totalScore: 0, breakdown: [] };
    $('catChip').textContent = `${cat.emoji} ${cat.name.toUpperCase()}`;
    renderStrip();
    loadRound(0);
  }

  function renderStrip() {
    const s = $('progressStrip');
    s.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'strip-piece';
      if (i < state.game.currentRound) p.classList.add('active');
      else if (i === state.game.currentRound) p.classList.add('current');
      s.appendChild(p);
    }
  }

  function loadRound(idx) {
    showScreen('screen-game');
    const cat = CATEGORIES[state.game.categoryId];
    const r = state.game.rounds[idx];
    state.game.currentRound = idx;
    $('roundNum').textContent = String(idx + 1);
    $('gameScore').textContent = state.game.totalScore;
    renderStrip();

    $('dialMin').textContent = cat.yearMin;
    $('dialMax').textContent = cat.yearMax;
    if (state.dial) state.dial.destroy();
    state.dial = buildDial(cat.yearMin, cat.yearMax, cat.defaultYear);

    const img = $('gameImage'), sk = $('skeleton');
    img.style.display = 'none'; sk.style.display = 'block'; img.src = '';

    stopTimer();
    const tw = $('timerWrap');
    if (state.timerMode) {
      tw.classList.remove('hidden');
      tw.style.display = '';
      $('timerBar').style.width = '100%';
      $('timerText').textContent = '15';
      $('timerBar').classList.remove('low');
    } else {
      tw.classList.add('hidden');
      tw.style.display = 'none';
    }
    $('btnGuess').disabled = true;

    let timedOut = false;
    const tHandle = setTimeout(() => { timedOut = true; onImageFail(); }, 5500);
    const loader = new Image();
    loader.onload = () => {
      if (timedOut) return;
      clearTimeout(tHandle);
      img.src = loader.src;
      img.style.display = 'block';
      sk.style.display = 'none';
      gsap.fromTo(img, { opacity: 0, scale: 1.06, filter: 'blur(8px) sepia(0.6)' }, { opacity: 1, scale: 1, filter: 'blur(0) sepia(0)', duration: 0.9 });
      gsap.fromTo($('gamePolaroid'), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' });
      $('btnGuess').disabled = false;
      if (state.timerMode) startTimer();
    };
    loader.onerror = () => { if (!timedOut) { clearTimeout(tHandle); onImageFail(); } };
    loader.src = r.url;

    const oldBtn = $('btnGuess'), newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener('click', () => {
      sfxStamp();
      submitGuess(state.dial.value);
    });
  }

  function onImageFail() {
    const catId = state.game.categoryId;
    const used = new Set(state.game.rounds.map(r => r.url));
    const fb = (FALLBACK_IMAGES[catId] || []).map(o => ({
      url: FB(o.file), year: o.year, title: o.title, fact: o.fact,
      source: `https://commons.wikimedia.org/wiki/File:${o.file}`
    })).filter(r => !used.has(r.url));
    if (fb.length) {
      state.game.rounds[state.game.currentRound] = fb[0];
      loadRound(state.game.currentRound);
    } else {
      toast('Imagen no disponible — saltando');
      finalizeRound(0);
    }
  }

  function startTimer() {
    stopTimer();
    const start = Date.now(), duration = 15000;
    state.timer = setInterval(() => {
      const remain = Math.max(0, duration - (Date.now() - start));
      const pct = (remain / duration) * 100;
      $('timerBar').style.width = pct + '%';
      $('timerText').textContent = Math.ceil(remain / 1000);
      if (remain <= 4000) $('timerBar').classList.add('low');
      if (remain <= 0) {
        stopTimer();
        sfxTimeout();
        submitGuess(state.dial.value, true);
      }
    }, 100);
  }
  function stopTimer() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    $('timerBar').classList.remove('low');
  }
  function getRemainingSecs() {
    if (!state.timerMode) return 0;
    return Math.max(0, Math.min(15, parseInt($('timerText').textContent || '0', 10)));
  }

  function submitGuess(year, timedOut = false) {
    stopTimer();
    $('btnGuess').disabled = true;
    const r = state.game.rounds[state.game.currentRound];
    const delta = Math.abs(year - r.year);
    const base = scoreFromDelta(delta);
    const bonus = state.timerMode && !timedOut ? getRemainingSecs() * 20 : 0;
    finalizeRound(base + bonus, { userYear: year, delta, base, bonus, timedOut });
  }

  function finalizeRound(total, info) {
    const r = state.game.rounds[state.game.currentRound];
    state.game.totalScore += total;
    state.game.breakdown.push({
      roundIdx: state.game.currentRound,
      year: r.year,
      userYear: info ? info.userYear : null,
      delta: info ? info.delta : null,
      points: total,
      base: info ? info.base : 0,
      bonus: info ? info.bonus : 0,
      timedOut: info ? info.timedOut : true,
      title: r.title,
      url: r.url,
      source: r.source,
      fact: r.fact
    });
    if (info && info.delta === 0) sfxCorrect();
    else if (info && info.delta <= 3) sfxClose();
    else sfxWrong();
    $('gameScore').textContent = state.game.totalScore;
    showResult();
  }

  function showResult() {
    const b = state.game.breakdown[state.game.breakdown.length - 1];
    const r = state.game.rounds[b.roundIdx];
    $('resultImage').src = r.url;
    $('resultYearStamp').textContent = r.year;
    $('resultUserYear').textContent = b.userYear != null ? b.userYear : '—';
    $('resultPoints').textContent = b.points;

    let dev;
    if (b.userYear == null) dev = '—';
    else if (b.delta === 0) dev = '0 ★';
    else dev = '±' + b.delta + 'a';
    $('resultDelta').textContent = dev;

    $('resultFact').textContent = r.fact && r.fact.length > 4 ? r.fact : `"${r.title}" — captada en ${r.year}.`;
    $('resultSource').innerHTML = r.source
      ? `Fuente: <a href="${r.source}" target="_blank" rel="noopener">Wikimedia Commons</a>`
      : '';

    showScreen('screen-result');

    const stamp = $('dateStamp');
    gsap.set(stamp, { scale: 0, rotate: -25, opacity: 0 });
    const tl = gsap.timeline();
    tl.from($('resultPolaroid'), { y: -40, opacity: 0, duration: 0.6, ease: 'back.out(1.4)' })
      .from('.result-stats .stat', { y: 20, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.3)
      .to(stamp, { scale: 1, rotate: -10, opacity: 0.95, duration: 0.5, ease: 'back.out(2.2)' }, 0.5)
      .from($('paperNote'), { y: 30, opacity: 0, duration: 0.5 }, 0.7);
    setTimeout(() => sfxStamp(), 500);

    const old = $('btnNext'), nw = old.cloneNode(true);
    old.parentNode.replaceChild(nw, old);
    const last = state.game.currentRound >= 9;
    nw.textContent = last ? '▸ INFORME FINAL' : '▸ SIGUIENTE FOTO';
    nw.addEventListener('click', () => {
      sfxClick();
      if (last) showFinal();
      else loadRound(state.game.currentRound + 1);
    });
  }

  /* ----------------------------- FINAL — receipt ------------------------- */
  function tier(score) {
    if (score >= 9000) return 'MAESTRO DE RETROGUESSER';
    if (score >= 7000) return 'EXCELENTE';
    if (score >= 5000) return 'BIEN JUGADO';
    if (score >= 3000) return 'SIGUE PRACTICANDO';
    return 'NECESITA MEJORAR';
  }

  function renderBarcode(target, seed) {
    target.innerHTML = '';
    let rng = seed || Math.floor(Math.random() * 9999999);
    function next() { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; }
    for (let i = 0; i < 50; i++) {
      const w = 2 + Math.floor(next() * 5);
      const isBar = next() > 0.4;
      const bar = document.createElement('div');
      bar.className = 'barcode-bar';
      bar.style.width = w + 'px';
      bar.style.background = isBar ? 'var(--blue)' : 'transparent';
      target.appendChild(bar);
    }
  }

  function showFinal() {
    sfxFinal();
    const g = state.game;
    const cat = CATEGORIES[g.categoryId];
    const subtotal = g.breakdown.reduce((a, b) => a + b.base, 0);
    const bonus = g.breakdown.reduce((a, b) => a + b.bonus, 0);
    const total = subtotal + bonus;

    $('receiptCategory').textContent = cat.name.toUpperCase();
    const d = new Date();
    $('receiptDate').textContent = d.toLocaleDateString() + ' · ' + d.toLocaleTimeString().slice(0,5);
    const ticket = String(Math.floor(Math.random() * 900000) + 100000);
    $('receiptTicket').textContent = '#' + ticket;

    const items = $('receiptItems');
    items.innerHTML = '';
    g.breakdown.forEach((b, i) => {
      const row = document.createElement('div');
      let cls = '', icon = '·';
      if (b.delta === 0)          { cls = ' perfect'; icon = '★'; }
      else if (b.points >= 700)   { icon = '✓'; }
      else if (b.points >= 100)   { icon = '~'; }
      else                        { cls = ' miss'; icon = '✗'; }
      row.className = 'receipt-item' + cls;
      const userTxt = b.userYear != null ? `tu ${b.userYear}` : 'sin resp.';
      const desc = `R${i+1} · ${b.year} (${userTxt})`;
      row.innerHTML = `
        <span class="qty">${icon}</span>
        <span class="desc">${desc}</span>
        <span class="pts">${b.base}</span>
      `;
      items.appendChild(row);
    });

    $('receiptSubtotal').textContent = subtotal;
    $('receiptBonus').textContent = '+' + bonus;
    // Hide the time-bonus row entirely when no timer mode is active
    const bonusRow = $('receiptBonus').parentElement;
    if (bonusRow) bonusRow.style.display = state.timerMode ? '' : 'none';
    $('receiptTotal').textContent = total + ' / 10000';
    $('receiptTier').textContent = tier(total);

    // Compute 1-10 rating from final score
    const rating = Math.max(1, Math.min(10, Math.round(total / 1000)));
    $('ratingNum').textContent = rating;

    renderBarcode($('barcode'), parseInt(ticket, 10));
    $('barcodeNum').textContent = ticket.slice(0,4) + ' ' + ticket.slice(4,8) + ' ' + Math.floor(Math.random()*10000).toString().padStart(4, '0');

    $('nicknameInput').value = '';
    $('btnSaveRanking').disabled = false;
    $('btnSaveRanking').textContent = '▸ GUARDAR EN EL RANKING';

    showScreen('screen-final');

    const tl = gsap.timeline();
    tl.from('#receipt', { y: -window.innerHeight, duration: 1, ease: 'power3.out' })
      .from('.receipt-item', { x: -20, opacity: 0, stagger: 0.08, duration: 0.3 }, 0.6)
      .from('.receipt-row.total', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '+=0.1')
      .to('#ratingBadge', { scale: 1, rotate: 8, opacity: 0.98, duration: 0.5, ease: 'back.out(2.5)' }, '+=0.1')
      .from('.final-actions > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.4 }, '+=0.1');
  }

  /* ----------------------------- RANKING --------------------------------- */
  const RANKING_KEY = 'retroguesser.ranking.v3'; // v3 = with mode field
  const SB = (window.PXL_SUPABASE || {});
  const SB_ENABLED = !!(SB.url && SB.anonKey);
  const SB_TABLE = 'scores';

  function localLoadAll() {
    try { return JSON.parse(localStorage.getItem(RANKING_KEY) || '[]'); } catch (e) { return []; }
  }
  function localSaveAll(arr) {
    try { localStorage.setItem(RANKING_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  async function sbFetch(filters = {}) {
    // filters: { mode, category }
    const params = new URLSearchParams();
    params.set('select', 'nickname,score,category,mode,created_at');
    params.set('order', 'score.desc');
    params.set('limit', '10');
    if (filters.mode) params.set('mode', 'eq.' + filters.mode);
    if (filters.category && filters.category !== 'all') params.set('category', 'eq.' + filters.category);
    const url = `${SB.url}/rest/v1/${SB_TABLE}?${params.toString()}`;
    const res = await fetch(url, {
      headers: { apikey: SB.anonKey, Authorization: 'Bearer ' + SB.anonKey }
    });
    if (!res.ok) throw new Error('Supabase fetch failed: ' + res.status);
    const rows = await res.json();
    return rows.map(r => ({
      nickname: r.nickname, score: r.score, category: r.category,
      mode: r.mode, date: r.created_at
    }));
  }

  async function sbInsert(entry) {
    const url = `${SB.url}/rest/v1/${SB_TABLE}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SB.anonKey,
        Authorization: 'Bearer ' + SB.anonKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        nickname: entry.nickname,
        score: entry.score,
        category: entry.category,
        mode: entry.mode
      })
    });
    if (!res.ok) throw new Error('Supabase insert failed: ' + res.status);
    return res.json();
  }

  async function loadRankingFor(filters) {
    if (SB_ENABLED) {
      try { return await sbFetch(filters); } catch (e) { /* fall through to local */ }
    }
    return localLoadAll().filter(e => {
      if (filters.mode && e.mode !== filters.mode) return false;
      if (filters.category && filters.category !== 'all' && e.category !== filters.category) return false;
      return true;
    });
  }

  async function saveCurrentToRanking() {
    if (!state.game) return;
    const nick = ($('nicknameInput').value || '').trim().slice(0, 16);
    if (!nick) { toast('Escribe un nombre'); $('nicknameInput').focus(); return; }

    const entry = {
      nickname: nick,
      category: state.game.categoryId,
      score: state.game.totalScore,
      mode: state.timerMode ? 'contrarreloj' : 'normal',
      date: new Date().toISOString()
    };

    $('btnSaveRanking').disabled = true;
    $('btnSaveRanking').textContent = '... GUARDANDO';

    // Always persist locally as a backup
    const all = localLoadAll();
    all.push(entry);
    localSaveAll(all);

    let savedRemote = false;
    if (SB_ENABLED) {
      try { await sbInsert(entry); savedRemote = true; } catch (e) { /* keep local-only */ }
    }

    // Find position in TOP 10 only — if you're not there, you're "fuera del top 10"
    let rank = null;
    try {
      const top10 = await loadRankingFor({ mode: entry.mode, category: entry.category });
      const sorted = top10.sort((a, b) => b.score - a.score).slice(0, 10);
      const idx = sorted.findIndex(e =>
        e.nickname === entry.nickname && e.score === entry.score &&
        e.category === entry.category && e.mode === entry.mode
      );
      if (idx >= 0 && idx < 10) rank = idx + 1;
    } catch (e) {}

    sfxStamp();
    $('btnSaveRanking').textContent = '✓ GUARDADO';
    // Pre-select this mode/category on the ranking screen so the player
    // lands on the leaderboard where their entry just appeared.
    state.rankingMode = entry.mode;
    state.rankingFilter = entry.category;
    if (rank) {
      toast(`▶ PUESTO #${rank} ${savedRemote ? 'GLOBAL' : 'LOCAL'} EN EL TOP 10`, 3800);
    } else {
      toast('// GUARDADO · FUERA DEL TOP 10', 3000);
    }
  }

  async function renderRanking() {
    // Mode tabs
    const m = $('rankingMode');
    m.innerHTML = '';
    const modes = [
      { id: 'normal',       name: '◷ NORMAL' },
      { id: 'contrarreloj', name: '⏱ CONTRARRELOJ' }
    ];
    modes.forEach(mo => {
      const b = document.createElement('button');
      b.textContent = mo.name;
      if (mo.id === state.rankingMode) b.classList.add('active');
      b.addEventListener('click', () => {
        if (mo.id === state.rankingMode) return;
        state.rankingMode = mo.id;
        sfxClick();
        renderRanking();
      });
      m.appendChild(b);
    });

    // Category filter
    const f = $('rankingFilter');
    f.innerHTML = '';
    const filters = [{ id:'all', name:'Todas', emoji:'🌐' }]
      .concat(Object.values(CATEGORIES).map(c => ({ id:c.id, name:c.name, emoji:c.emoji })));
    filters.forEach(fl => {
      const b = document.createElement('button');
      b.textContent = `${fl.emoji} ${fl.name.toUpperCase()}`;
      if (fl.id === state.rankingFilter) b.classList.add('active');
      b.addEventListener('click', () => { state.rankingFilter = fl.id; renderRanking(); sfxClick(); });
      f.appendChild(b);
    });

    // Loading state
    const list = $('rankingList');
    list.innerHTML = '<div class="ranking-empty">// CARGANDO REGISTROS...</div>';

    const data = await loadRankingFor({
      mode: state.rankingMode,
      category: state.rankingFilter
    });
    const all = data.sort((a, b) => b.score - a.score).slice(0, 10);

    list.innerHTML = '';
    if (!all.length) {
      const e = document.createElement('div');
      e.className = 'ranking-empty';
      e.textContent = '// AÚN NO HAY REGISTROS';
      list.appendChild(e);
      return;
    }
    const medals = ['🥇','🥈','🥉'];
    all.forEach((e, i) => {
      const cat = CATEGORIES[e.category];
      const card = document.createElement('div');
      card.className = 'collector-card' + (i < 3 ? ' top-' + (i+1) : '');
      const rankStr = i < 3 ? `<span class="card-medal">${medals[i]}</span>` : `<span class="card-rank">#${i+1}</span>`;
      const date = new Date(e.date);
      const dStr = isNaN(date) ? '' : date.toLocaleDateString();
      card.innerHTML = `
        ${rankStr}
        <div class="card-name">${escapeHtml(e.nickname)}</div>
        <div class="card-meta">${cat ? cat.emoji + ' ' + cat.name.toUpperCase() : e.category} · ${dStr}</div>
        <div class="card-score">
          <span class="card-score-num">${e.score}</span>
          <span class="card-score-label">PTS</span>
        </div>
      `;
      list.appendChild(card);
    });

    gsap.from('.collector-card', { y: 30, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'back.out(1.2)' });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  /* ----------------------------- SHARE ----------------------------------- */
  function shareToTwitter() {
    if (!state.game) return;
    const cat = CATEGORIES[state.game.categoryId];
    const text = `¡He conseguido ${state.game.totalScore}/10000 en RetroGuesser (${cat.emoji} ${cat.name})! ¿Puedes superarme? 🎯`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  /* ----------------------------- INIT ------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => $('boot').classList.add('gone'), 400);

    setupIntro();
    const wake = () => { ensureAudio(); document.removeEventListener('pointerdown', wake); };
    document.addEventListener('pointerdown', wake, { once: true });

    function backToHome() {
      sfxClick();
      stopTimer();
      if (state.dial) { state.dial.destroy(); state.dial = null; }
      showScreen('screen-home');
      // Nuke the old home scene + canvas listeners and rebuild from scratch —
      // guarantees a clean visual state regardless of any leftover tween/state.
      if (state.homeScene && state.homeScene.stop) state.homeScene.stop();
      const oldCanvas = $('homeCanvas');
      const fresh = oldCanvas.cloneNode(false);
      oldCanvas.parentNode.replaceChild(fresh, oldCanvas);
      requestAnimationFrame(() => {
        state.homeScene = createHomeScene($('homeCanvas'), (catId) => {
          state.selectedCategory = catId;
          startGame();
        });
      });
    }
    $('btnReplay').addEventListener('click', () => { sfxClick(); startGame(); });
    $('btnShare').addEventListener('click', () => { sfxClick(); shareToTwitter(); });
    $('btnSaveRanking').addEventListener('click', saveCurrentToRanking);
    $('btnHomeFromFinal').addEventListener('click', backToHome);
    $('btnHomeFromRanking').addEventListener('click', backToHome);
    $('btnHomeFromGame').addEventListener('click', backToHome);
    $('btnHomeFromResult').addEventListener('click', backToHome);
    // Floating top-left "← MENÚ" buttons (always visible on result and final)
    const fabResult = $('btnHomeFromResultTop');
    if (fabResult) fabResult.addEventListener('click', backToHome);
    const fabFinal = $('btnHomeFromFinalTop');
    if (fabFinal) fabFinal.addEventListener('click', backToHome);
  });

})();
