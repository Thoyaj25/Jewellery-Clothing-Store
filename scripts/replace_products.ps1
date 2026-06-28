$dest = 'd:\Ultimate Collections\jewellery-clothing-store\public\products'
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }
Remove-Item -Recurse -Force "$dest\*" -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force 'C:\Users\DURGA PRASAD PJ\Pictures\Screenshots\Products\*' $dest
Write-Output '--- Copied files ---'
Get-ChildItem -Recurse $dest | Select-Object -ExpandProperty FullName
