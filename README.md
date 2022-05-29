# Hyperion

Hyperion è un progetto per tenere traccia dei consumi energetici attraverso un'applicazione web ottimizzata e intuitiva.

L'applicazione è stata sviluppata per il corso PROGETTO DI INGEGNERIA INFORMATICA (5 CFU) - 089020.

**Docenti**: prof. Bolchini, prof. Fugini

## Autori

| Name     | Surname    | Email                              | GitHub                                            |
|:---------|:-----------|:-----------------------------------|:--------------------------------------------------|
| Claudio  | Arione     | claudio.arione@mail.polimi.it      | [claudioarione](https://github.com/claudioarione) |
| Riccardo | Begliomini | riccardo.begliomini@mail.polimi.it | [iVoid73](https://github.com/iVoid73)             |
| Giuseppe | Boccia     | giuseppe.boccia@mail.polimi.it     | [giuse-boccia](https://github.com/giuse-boccia)   |

# Guida per l’installazione

Di seguito una guida per l’istallazione del progetto su un dispositivo generico Linux

## 1. Configurazione iniziale

Assegnare al dispositivo su cui si sta installando il progetto un hostname univoco. Nel caso di un Raspberry si può
usare il comando `raspi-config` da terminale.

In alternativa è possibile impostare un indirizzo IP statico

> ⚠️ Dopo aver cambiato l’hostname è necessario riavviare il dispositivo per rendere effettive le modifiche

## 2. Installazione di Apache Web Server

Installare Apache web server. Su Rapberry ciò può essere fatto con `sudo apt-get install apache2 -y`


> 🌐 Al termine dell’installazione, inserendo ***hostname*.local** (oppure l’indirizzo ip) nella barra degli indirizzi di un browser da un dispositivo connesso alla stessa rete locale del Raspberry, si dovrebbe visualizzare la pagina di benvenuto di Apache. Per esempio, se come hostname si è impostato *hyperion* la pagina è visibile inserendo ***hyperion.local*** nella barra degli indirizzi del browser. Se così non fosse, controllare la sezione troubleshooting Apache.

## 3. Download del codice dalla repository

Clonare la repository da Github nella root del webserver `/var/www/html`, per fare ciò è sufficiente eseguire i seguenti
comandi

```
cd /var/www/html
sudo su
rm index.html
git clone https://github.com/claudioarione/hyperion.git .
```

## 4. Configurazione del web server

Inserire le seguenti righe nel file di configurazione di Apache, situato in `/etc/apache2/apach2.conf`, sostituendo
/PATH/TO/FILE con la vera path al file contenente le misurazioni energetiche

NOTA: **non** aggiungere uno slash alla fine della path

```yaml
# directory per energy.csv
Alias /csv /PATH/TO/FILE
<Directory /PATH/TO/FILE>
Require all granted
AllowOverride None
</Directory>
```

Per esempio, se il file con le misurazioni si trova in */home/pi/measurements/energy.csv*, al posto di */PATH/TO/FILE*
andrà inserito */home/pi/measurements* (e non */home/pi/measurements/*)

## 5. Configurazione delle constanti

Aprire con un editor di testo il file `util/constants.js` e modificare le constanti `ENERGY_VALUES_FILE_PATH`
e `MISURATION_INTERVAL`.


> 💡 Le altre costanti nel file possono essere lasciate ai valori di default o modificate a proprio piacimento. Non garantiamo il corretto funzionamento del sito con una configurazione non standard


**a. ENERGY_VALUES_FILE_PATH**

Stringa contente la path (relativa rispetto a `scripts`) al file che contiene le misurazioni energetiche. Per esempio se
il file si trova in */home/pi/measurements/energy_values.csv* e la cartella */home/pi/measurements* è stata mappata in *
/csv* nel file di configurazione del web server, la costante dovrà avere il valore `"./csv/energy_values.csv"`

**b. MISURATION_INTERVAL**

Numero di secondi (in media) tra una misurazione e la successiva nel file che contiene le misurazioni energetiche

### Troubleshooting Apache

Se il web server apache non risulta raggiungibile nella rete locale usando hostname.local provare a inserire
direttamente l’indirizzo IP nella barra degli indirizzi del browser (es. 192.168.1.123). Se questo risolve il problema,
sarà necessario configurare l’IP statico per il dispositivo su cui è installato Apache. Se questo non risolve il
problema provare ad accedere alla pagina dallo stesso dispositivo su cui è installato Apache
scrivendo *[localhost](http://localhost)* nella barra degli indirizzi del browser. Se la pagina viene visualizzata,
accertarsi che non ci siano firewall o filtri di rete che bloccano la pagina quando ci si connette da altri dispositivi.
Se anche in questo caso la pagina non viene visualizzata, assicurarsi che l’installazione di apache sia avvenuta
correttamente ed eventualmente controllare l’output del comando `sudo systemclt status apache2`
