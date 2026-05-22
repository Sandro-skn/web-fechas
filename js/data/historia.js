/* HISTORIA — fotos icónicas y retratos famosos.
   Cada entrada: { file, year, title, fact }
   - file:  nombre del archivo en Wikimedia Commons (verifica que exista)
   - year:  año de la foto / del evento
   - title: nombre corto que se mostrará
   - fact:  dato curioso (1 línea) que aparece en la pantalla de resultado
   Para añadir más: copia una línea y edita los campos. Es ARRAY de objetos. */
window.PXL_DATA = window.PXL_DATA || {};
window.PXL_DATA.historia = [
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
  { file:'Pablo_picasso_1.jpg', year:1962, title:'Pablo Picasso', fact:'El pintor andaluz, cofundador del cubismo, en su madurez.' },
  { file:'Lunch_atop_a_Skyscraper_-_Charles_Clyde_Ebbets.jpg', year:1932, title:'Lunch atop a Skyscraper', fact:'Obreros almorzando sobre una viga del Rockefeller Center durante su construcción.' },
  { file:'Capa,_Death_of_a_Loyalist_Soldier.jpg', year:1936, title:'Muerte de un miliciano', fact:'Icónica foto de Robert Capa durante la Guerra Civil española.' },
  { file:'Eagle_nebula_pillars.jpg', year:1995, title:'Pilares de la Creación', fact:'El Hubble fotografió las columnas de gas y polvo de la Nebulosa del Águila.' },
  { file:'Pale_Blue_Dot.png', year:1990, title:'Pale Blue Dot', fact:'La Voyager 1 fotografió la Tierra desde más de 6.000 millones de km.' },
  { file:'The_Blue_Marble,_AS17-148-22727.jpg', year:1972, title:'The Blue Marble', fact:'La famosa imagen de la Tierra entera tomada desde el Apolo 17.' },
  { file:'Mahatma-Gandhi,_studio,_1931.jpg', year:1931, title:'Mahatma Gandhi', fact:'Retrato de estudio del líder pacifista indio durante su visita a Londres.' },
  { file:'Nelson_Mandela_1994.jpg', year:1994, title:'Nelson Mandela', fact:'Foto del año en que se convirtió en presidente de Sudáfrica.' },
  { file:'Salvador_Dalí_1939.jpg', year:1939, title:'Salvador Dalí', fact:'El pintor surrealista español en plena efervescencia creativa.' },
  { file:'RIAN_archive_850809_General_Secretary_of_the_CPSU_CC_M._Gorbachev_(crop).jpg', year:1985, title:'Mijaíl Gorbachov', fact:'Recién nombrado secretario general del PCUS, impulsor de la Perestroika.' },
  { file:'West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg', year:1989, title:'Caída del Muro de Berlín', fact:'Alemanes del este y oeste celebran juntos en la Puerta de Brandeburgo.' },
  { file:'Steve_Jobs_Headshot_2010_(cropped_4).jpg', year:2010, title:'Steve Jobs', fact:'El cofundador de Apple en el año del lanzamiento del iPad.' },
  { file:'Sigmund_Freud,_by_Max_Halberstadt_(cropped).jpg', year:1921, title:'Sigmund Freud', fact:'Retrato del padre del psicoanálisis por Max Halberstadt.' },
  { file:'Marie_Curie_c._1920s.jpg', year:1925, title:'Marie Curie', fact:'Doble Premio Nobel, en Física (1903) y Química (1911).' },
  { file:'Muhammad_Ali_NYWTS.jpg', year:1967, title:'Muhammad Ali', fact:'El boxeador en el año en que rehusó ser reclutado para Vietnam.' },
  { file:'Challenger_explosion.jpg', year:1986, title:'Explosión del Challenger', fact:'El transbordador estalló 73 segundos después del despegue el 28 de enero de 1986.' },
  { file:'WTC_smoking_on_9-11.jpeg', year:2001, title:'11-S', fact:'Las Torres Gemelas en llamas tras los atentados del 11 de septiembre.' }
];
