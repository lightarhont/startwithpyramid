pageobj.checkall = (function()
                  {
                      $('#select-all').click( function() { // при клике по главному чекбоксу
                        if($('#select-all').attr('checked')){ // проверяем его значение
                            $('.itemcheck:enabled').attr('checked', true); // если чекбокс отмечен, отмечаем все чекбоксы
                            }
                            else {
                                $('.itemcheck:enabled').attr('checked', false); // если чекбокс не отмечен, снимаем отметку со всех чекбоксов
                            }
                        });
                  }
                 );