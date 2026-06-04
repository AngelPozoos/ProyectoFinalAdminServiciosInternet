import threading
import requests
import time

# CONFIGURACIÓN DEL TEST
URL = "http://25.0.149.x" # IP de la VM1 (Gateway)
PETICIONES_TOTALES = 5000
CONCURRENCIA = 50 # Hilos simultáneos

resultados = {"exito": 0, "error": 0}
tiempos = []

def enviar_peticion():
    try:
        inicio = time.time()
        r = requests.get(URL, timeout=10)
        fin = time.time()
        if r.status_code == 200:
            resultados["exito"] += 1
            tiempos.append(fin - inicio)
        else:
            resultados["error"] += 1
    except:
        resultados["error"] += 1

print(f"Iniciando evaluación de carga a {URL}...")
inicio_test = time.time()

threads = []
for i in range(PETICIONES_TOTALES):
    t = threading.Thread(target=enviar_peticion)
    threads.append(t)
    t.start()
   
    # Control de ráfagas para evitar saturación del host local
    if len(threads) >= CONCURRENCIA:
        for t in threads: t.join()
        threads = []

fin_test = time.time()

# REPORTE DE RESULTADOS
print("\n" + "="*30)
print("   REPORTE DE RENDIMIENTO")
print("="*30)
print(f"Peticiones totales: {PETICIONES_TOTALES}")
print(f"Éxitos:             {resultados['exito']}")
print(f"Errores:            {resultados['error']}")
print(f"Tiempo total:       {fin_test - inicio_test:.2f} s")
if tiempos:
    print(f"Promedio latencia:  {sum(tiempos)/len(tiempos):.4f} s/pet")
print("="*30)

