# rename-images.ps1
# Renames the Home & Kitchen product photos to clean, safe filenames.
# Uses loose (single-keyword) wildcard matching so slight differences in
# spacing/punctuation/emoji in the original filename don't matter.
#
# HOW TO RUN:
#   1. Open PowerShell
#   2. cd "C:\Users\N\Desktop\e commerce web\images"
#   3. powershell -ExecutionPolicy Bypass -File .\rename-images.ps1

function Rename-ByKeyword {
    param(
        [string]$Keyword,
        [string]$NewName
    )
    $match = Get-ChildItem -LiteralPath . -File | Where-Object { $_.Name -like "*$Keyword*" } | Select-Object -First 1
    if ($match) {
        Rename-Item -LiteralPath $match.FullName -NewName $NewName -Force
        Write-Host "Renamed: $($match.Name)  ->  $NewName" -ForegroundColor Green
        return $true
    } else {
        Write-Host "NOT FOUND for keyword: $Keyword" -ForegroundColor Yellow
        return $false
    }
}

$renamed = 0
$total = 7

if (Rename-ByKeyword -Keyword "Cusimax"       -NewName "hk-115-cusimax-toaster.jfif")        { $renamed++ }
if (Rename-ByKeyword -Keyword "COMFEE"        -NewName "hk-116-comfee-microwave.jfif")       { $renamed++ }
if (Rename-ByKeyword -Keyword "Pastel Green"  -NewName "hk-117-smeg-toaster-pastel-green.jfif") { $renamed++ }
if (Rename-ByKeyword -Keyword "Jade"          -NewName "hk-118-smeg-toaster-jade.jfif")      { $renamed++ }
if (Rename-ByKeyword -Keyword "3D Render"     -NewName "hk-119-smeg-toaster-sage.jfif")      { $renamed++ }
if (Rename-ByKeyword -Keyword "GL-C652HLCM"   -NewName "hk-120-lg-fridge.jfif")               { $renamed++ }
if (Rename-ByKeyword -Keyword "Big Chill"     -NewName "hk-121-bigchill-fridge.jfif")         { $renamed++ }

Write-Host ""
Write-Host "Done. Renamed $renamed of $total file(s)." -ForegroundColor Cyan

if ($renamed -lt $total) {
    Write-Host ""
    Write-Host "Remaining .jfif files still in this folder (for anything not matched above):" -ForegroundColor Cyan
    Get-ChildItem -LiteralPath . -File -Filter "*.jfif" | ForEach-Object { Write-Host "  - $($_.Name)" }
}
