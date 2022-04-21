$username=$args[0]

$username | Out-File user.txt
slimerjs .\getpages.js
slimerjs .\getposts.js
slimerjs .\getdrivelinks.js
Write-Host "Done, output written to links.json."
Remove-Item .\pages.json
Remove-Item .\posts.json
Remove-Item .\user.txt