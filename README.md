"# letcss"

go here for documentation: https://letcss.netlify.app/

#we can set classes for a var using: let()
store multiple classes
(v5)
let('var-name','class-1,class-2')
(v6)
let('var-name','class-1 class-2')

#we can use stored classes using: set()
use multiple vars and add or remove classes from them
(v5)
set('var-name-1,var-name-2,',add('class-1,class-2'),remove('class-1,class-2'))
(v6)
set('var-name-1 var-name-2,',add('class-1 class-2'),remove('class-1 class-2'))
