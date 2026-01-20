param(
    [string]$Source = "C:\Users\linki\Desktop\Climet\img",
    [string]$TargetSubfolder = "optimized",
    [int]$MaxWidth = 1600,
    [int]$MaxHeight = 900,
    [int]$Quality = 75
)

$target = Join-Path $Source $TargetSubfolder
if (-not (Test-Path -LiteralPath $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
}

$files = Get-ChildItem -Path $Source -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' }
if (-not $files) {
    Write-Warning "Nenhuma imagem JPG ou PNG encontrada em $Source."
    exit 0
}

$scale = "scale={0}:{1}:force_original_aspect_ratio=decrease" -f $MaxWidth, $MaxHeight

foreach ($file in $files) {
    $out = Join-Path $target ($file.BaseName + '.webp')
    $arguments = @('-y','-i', $file.FullName, '-vf', $scale, '-c:v', 'libwebp', '-q:v', $Quality, '-compression_level', '6', '-preset', 'picture', $out)
    Write-Host "Convertendo $($file.Name) -> $(Split-Path $out -Leaf)" -ForegroundColor Cyan
    & ffmpeg @arguments
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Falha ao converter $($file.Name). Código: $LASTEXITCODE"
    }
}
