## Требование к файлу
- Строки чисел любой длины
- Последняя строка должна быть пустая

## 1 способ _sortUnix.ts_
Делегирование задачи системе

## 2 способ _sortStream.ts_
Считывание файла в потоке чанками по 500мб. Применяется пузырьковая сортировка. Создается временный файл для фиксации результатов промежуточной сортировки. 
