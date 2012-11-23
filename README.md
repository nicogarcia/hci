git config --global user.name nicogarcia
git config --global user.email nicoalbo90@gmail.com
// contraseña nicoocho

# iniciar repositorio local
git init
# agregar repositorio remoto
git remote add origin https://github.com/nicogarcia/hci.git

# obtener todo de la rama master remota
git pull -u origin master

# agregar todos los archivos actuales al repositorio local
git add *

# hacer commit si se hizo algun cambio agregando -a sincroniza totalmente
# si borraste algo lo borra de git, si agregaste agrega, etc.
git commit -m "start"

# aplicar los cambios en el remoto
git push

