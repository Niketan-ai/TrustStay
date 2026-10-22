# scripts/run-psql.ps1
param(
    [Parameter(Mandatory=$true)][string]$Sql
)
# Absolute path to psql executable (found during inspection)
$psqlPath = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
# Execute psql with safe argument passing. -t removes headers/trailing whitespace.
& $psqlPath -U postgres -d truststay_db -t -c $Sql
