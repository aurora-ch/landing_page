# Intégration CRM : Connecter Votre Assistant IA à Salesforce, HubSpot & Co.

**Meta description :** Guide technique pour intégrer votre assistant vocal IA à Salesforce, HubSpot, Pipedrive. APIs, webhooks, synchronisation : tout ce qu'il faut savoir.

---

## Introduction : Pourquoi l'intégration CRM est non-négociable

Un assistant vocal qui répond à vos clients, c'est bien. Un assistant vocal qui **connaît vos clients**, les reconnaît, met à jour leur fiche et déclenche des actions automatiques : c'est transformationnel.

Sans intégration CRM, chaque appel est une île isolée. Les informations collectées disparaissent, les suivis sont manuels, et vos commerciaux perdent un temps précieux à ressaisir des données.

**Avec une intégration CRM bien faite :**
- L'IA sait qui appelle avant même de décrocher
- Chaque interaction enrichit automatiquement la fiche client
- Les tâches de suivi se créent toutes seules
- Vos équipes ont une vue complète du parcours client

Cet article vous guide pas à pas pour connecter votre assistant IA à votre CRM, quel qu'il soit.

---

## Les données perdues lors d'appels non intégrés

### L'iceberg de la perte d'information

Chaque appel téléphonique génère des données précieuses :

**Données visibles (souvent saisies manuellement) :**
- Nom du contact
- Objet de l'appel
- Action requise

**Données invisibles (généralement perdues) :**
- Heure précise et durée de l'appel
- Nombre de tentatives avant succès
- Questions posées et réponses données
- Sentiment du client (satisfait, frustré...)
- Produits/services mentionnés
- Intentions d'achat détectées
- Historique des interactions précédentes

### Impact business quantifié

| Donnée perdue | Conséquence | Coût estimé |
|---------------|-------------|-------------|
| Intention d'achat non tracée | Opportunité manquée | 500-2000 CHF/lead |
| Réclamation non documentée | Client perdu | Valeur vie client |
| Préférence non enregistrée | Expérience dégradée | -15% rétention |
| Suivi non déclenché | Vente non conclue | Variable |

### Le cercle vicieux de la ressaisie

```
Client appelle → IA collecte info → Pas d'intégration
                                           ↓
                               Info perdue ou mail envoyé
                                           ↓
                               Commercial ressaisit manuellement
                                           ↓
                               Erreurs, oublis, délais
                                           ↓
                               Client rappelle frustré
```

---

## Architecture d'intégration : APIs et webhooks

### Comprendre les concepts de base

**API (Application Programming Interface)**
- Une "porte d'entrée" pour communiquer avec un logiciel
- Permet de lire et écrire des données
- Exemple : L'API Salesforce permet de créer un contact via code

**Webhook**
- Une notification automatique envoyée lors d'un événement
- Fonctionne en "push" (le système vous prévient)
- Exemple : Aurora envoie une notification quand un appel se termine

**Synchronisation bidirectionnelle**
- Les données circulent dans les deux sens
- L'IA lit le CRM ET écrit dans le CRM
- Le CRM met à jour l'IA ET reçoit les updates

### Architecture typique

```
┌─────────────────────────────────────────────────────────────┐
│                         AURORA AI                            │
│                    (Assistant vocal IA)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    APIs / Webhooks
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐     ┌──────────┐    ┌──────────┐
    │ CRM     │     │ Agenda   │    │ ERP      │
    │Salesforce│    │Google Cal│    │ SAP      │
    │HubSpot  │     │Outlook   │    │ Odoo     │
    └─────────┘     └──────────┘    └──────────┘
```

### Types de flux de données

| Flux | Direction | Exemple |
|------|-----------|---------|
| Identification | CRM → IA | "Ce numéro correspond à Jean Dupont, client Gold" |
| Enrichissement | IA → CRM | "Nouveau : intéressé par le produit X" |
| Action | IA → CRM | "Créer tâche : rappeler demain 10h" |
| Synchronisation | Bidirectionnel | Mise à jour coordonnée des disponibilités |

---

## Guide pas-à-pas : Intégration Salesforce

### Prérequis

- Compte Salesforce (Professional, Enterprise ou Unlimited)
- Accès administrateur
- API activée (incluse dans ces éditions)
- Compte Aurora AI configuré

### Étape 1 : Créer une Connected App dans Salesforce

1. **Setup** → **App Manager** → **New Connected App**
2. Remplissez les informations de base :
   - Connected App Name : "Aurora AI Integration"
   - API Name : aurora_ai_integration
   - Contact Email : votre email

3. Activez OAuth :
   - Enable OAuth Settings : ✓
   - Callback URL : `https://app.aurora-ai.ch/oauth/callback`
   - Selected OAuth Scopes :
     - Access and manage your data (api)
     - Perform requests on your behalf (refresh_token, offline_access)

4. **Save** et notez le **Consumer Key** et **Consumer Secret**

### Étape 2 : Configurer Aurora AI

Dans le dashboard Aurora AI :

1. **Intégrations** → **+ Nouvelle intégration** → **Salesforce**
2. Entrez vos credentials :
   - Consumer Key : [votre clé]
   - Consumer Secret : [votre secret]
   - Instance URL : https://[votre-instance].salesforce.com
3. Cliquez sur **Autoriser** et connectez-vous à Salesforce
4. Accordez les permissions demandées

### Étape 3 : Mapper les champs

Configurez la correspondance entre les données Aurora et Salesforce :

| Donnée Aurora | Champ Salesforce | Action |
|---------------|------------------|--------|
| Numéro appelant | Phone / Mobile | Recherche contact |
| Nom détecté | Name | Mise à jour si vide |
| Email collecté | Email | Création/MAJ |
| Objet appel | Task.Subject | Création automatique |
| Résumé | Task.Description | Création automatique |
| Produit mentionné | Opportunity.Product | Création opportunité |

### Étape 4 : Configurer les automatisations

**Automatisation 1 : Création de tâche post-appel**
```
Déclencheur : Fin d'appel
Action : Créer Task dans Salesforce
Champs :
  - Subject : "Appel [entrant/sortant] - [date]"
  - Description : [Résumé automatique de l'appel]
  - WhoId : [ID du contact]
  - Priority : [Normal/High si urgence détectée]
  - ActivityDate : [Aujourd'hui]
```

**Automatisation 2 : Alerte commercial**
```
Déclencheur : Intention d'achat détectée
Action : Créer Alert / Notification
Destinataire : Owner du compte
Message : "Opportunité chaude - [Nom client] intéressé par [Produit]"
```

### Étape 5 : Tester l'intégration

1. Créez un contact test dans Salesforce avec votre numéro
2. Appelez votre numéro Aurora AI
3. Vérifiez dans Salesforce :
   - L'appel est-il loggé comme Activity ?
   - Les informations sont-elles correctes ?
   - Les automatisations se déclenchent-elles ?

---

## Guide pas-à-pas : Intégration HubSpot

### Prérequis

- Compte HubSpot (Professional ou Enterprise)
- Accès super admin
- API Private App créée
- Compte Aurora AI configuré

### Étape 1 : Créer une Private App HubSpot

1. **Settings** → **Integrations** → **Private Apps**
2. **Create a private app**
3. Configurez :
   - Name : "Aurora AI"
   - Description : "Intégration assistant vocal"

4. **Scopes** → Sélectionnez :
   - crm.objects.contacts (Read/Write)
   - crm.objects.deals (Read/Write)
   - crm.objects.companies (Read)
   - sales-email-read
   - timeline (Write)

5. **Create app** et copiez l'**Access Token**

### Étape 2 : Configurer Aurora AI

1. **Intégrations** → **+ Nouvelle intégration** → **HubSpot**
2. Collez votre Access Token
3. Testez la connexion

### Étape 3 : Configurer le mapping

HubSpot utilise un système de propriétés personnalisables :

| Donnée Aurora | Propriété HubSpot | Type |
|---------------|-------------------|------|
| Téléphone | phone | Recherche |
| Email | email | Recherche/MAJ |
| Dernier appel | last_aurora_call | Date (custom) |
| Score qualification | aurora_lead_score | Number (custom) |
| Résumé dernier appel | aurora_call_summary | Text (custom) |

**Créer les propriétés custom :**
1. **Settings** → **Properties** → **Contact properties**
2. **Create property** pour chaque champ custom nécessaire

### Étape 4 : Workflows automatiques

Utilisez les workflows HubSpot pour automatiser les actions post-appel :

**Workflow 1 : Enrichissement contact**
```
Trigger : Contact property "last_aurora_call" is known
Action 1 : Set property "Contact owner" = [Commercial assigné]
Action 2 : Add to list "Contacts actifs"
Action 3 : Create task "Follow-up [Nom]" due in 1 day
```

**Workflow 2 : Création deal automatique**
```
Trigger : Contact property "aurora_lead_score" > 80
Action : Create deal
  - Deal name : "Opportunité [Nom contact]"
  - Pipeline : Sales Pipeline
  - Deal stage : Qualified
  - Amount : [Estimé si disponible]
```

---

## Autres CRM populaires : Pipedrive, Zoho, etc.

### Pipedrive

**Connexion :**
- API Token disponible dans Settings → Personal preferences → API
- Endpoint : `https://api.pipedrive.com/v1/`

**Particularités :**
- Excellent pour la gestion de pipeline commercial
- Création automatique de "Activities" pour chaque appel
- Mapping simple vers les "Deals"

**Cas d'usage typique :**
```
Appel entrant → Identification contact → Création Activity
     ↓
Intention achat détectée → Création/MAJ Deal → Notification commercial
```

### Zoho CRM

**Connexion :**
- OAuth 2.0 via Zoho Developer Console
- Scopes nécessaires : ZohoCRM.modules.ALL

**Particularités :**
- Très personnalisable
- Modules personnalisés possibles
- Intégration native avec Zoho suite

**Mapping recommandé :**
| Aurora | Zoho Module | Zoho Field |
|--------|-------------|------------|
| Contact | Leads/Contacts | Phone, Mobile |
| Appel | Calls | Subject, Description |
| Opportunité | Potentials | Potential Name |

### Monday.com CRM

**Connexion :**
- API v2 GraphQL
- Token dans Admin → API

**Particularités :**
- Très visuel
- Idéal pour équipes non-techniques
- Automatisations natives puissantes

### Notion (CRM artisanal)

Pour les startups utilisant Notion comme CRM :

**Connexion :**
- API Notion via integration interne
- Base de données comme "table" CRM

**Limitations :**
- Pas de recherche par téléphone native
- Synchronisation moins temps réel
- Adapté aux petits volumes

---

## Synchronisation bidirectionnelle : Cas d'usage avancés

### Cas 1 : Personnalisation temps réel

```
Client appelle
     ↓
Aurora interroge le CRM (< 200ms)
     ↓
Récupère : Nom, historique, préférences, statut
     ↓
IA personnalise l'accueil :
"Bonjour Monsieur Dupont, ravi de vous entendre à nouveau.
La dernière fois, vous aviez une question sur votre commande.
Puis-je vous aider avec autre chose aujourd'hui ?"
```

### Cas 2 : Mise à jour du statut client

```
IA détecte une insatisfaction forte
     ↓
Aurora met à jour le CRM :
- Champ "Satisfaction" = "At Risk"
- Crée alerte pour Account Manager
     ↓
Workflow CRM déclenché :
- Email au manager
- Tâche de rappel prioritaire
- Ajout au segment "Clients à risque"
```

### Cas 3 : Qualification de lead automatique

```
Nouveau prospect appelle
     ↓
IA pose questions de qualification :
- Budget estimé ?
- Échéance projet ?
- Décisionnaire ?
     ↓
Aurora calcule un score et crée :
- Contact avec score BANT
- Opportunité si score > seuil
- Assignation automatique au commercial
```

### Cas 4 : Suivi post-appel intelligent

```
Appel terminé avec promesse de rappel
     ↓
Aurora crée dans le CRM :
- Tâche "Rappeler [Client]" à J+2
- Note avec contexte complet
     ↓
À J+2, CRM rappelle au commercial
     ↓
Commercial voit le contexte complet
avant de rappeler
```

---

## Automatisation des workflows post-appel

### Framework d'automatisation

Définissez vos règles selon ce modèle :

```
SI [condition]
ALORS [action(s)]
AVEC [données]
```

### Exemples de règles

**Règle 1 : Lead chaud**
```
SI score_qualification > 80 ET budget_mentionné = true
ALORS
  - Créer opportunité (stage: Qualified)
  - Assigner au commercial senior
  - Envoyer email d'introduction automatique
AVEC
  - Résumé de l'appel
  - Produits d'intérêt
  - Budget estimé
```

**Règle 2 : Réclamation urgente**
```
SI type_appel = "réclamation" ET sentiment = "négatif"
ALORS
  - Créer case/ticket priorité haute
  - Notifier manager du compte
  - Bloquer emails marketing temporairement
AVEC
  - Transcription de l'appel
  - Historique des interactions
  - Valeur du client (LTV)
```

**Règle 3 : Rendez-vous pris**
```
SI rendez_vous_créé = true
ALORS
  - Créer événement dans CRM
  - Synchroniser avec agenda commercial
  - Envoyer confirmation client (email + SMS)
  - Créer rappel J-1
AVEC
  - Date, heure, durée
  - Objet du rendez-vous
  - Préparation suggérée
```

### Outils de workflow recommandés

| Outil | Usage | Complexité |
|-------|-------|------------|
| Workflows natifs CRM | Règles simples | Faible |
| Zapier | Connexions multiples | Moyenne |
| Make (Integromat) | Logiques complexes | Moyenne |
| n8n | Self-hosted, illimité | Élevée |
| Code custom | Cas très spécifiques | Élevée |

---

## Sécurité des données lors de l'intégration

### Principes fondamentaux

**1. Authentification sécurisée**
- OAuth 2.0 privilégié (pas de mot de passe stocké)
- Tokens à durée limitée avec refresh
- Scopes minimaux (principe du moindre privilège)

**2. Chiffrement des données**
- HTTPS obligatoire pour tous les échanges
- Chiffrement au repos dans les deux systèmes
- Pas de données sensibles dans les logs

**3. Conformité LPD/RGPD**
- Données hébergées en Suisse de préférence
- Documentation des flux de données
- Possibilité de suppression sur demande

### Checklist sécurité

Avant de mettre en production :

- [ ] OAuth configuré (pas d'API key simple)
- [ ] Scopes limités au strict nécessaire
- [ ] HTTPS vérifié pour tous les endpoints
- [ ] Logs d'accès activés
- [ ] Procédure de révocation documentée
- [ ] Test de suppression de données effectué
- [ ] Contrat de sous-traitance vérifié

### Gestion des accès

| Rôle | Accès Aurora | Accès CRM |
|------|--------------|-----------|
| Admin technique | Configuration intégration | Admin API |
| Manager commercial | Dashboard, rapports | Lecture/écriture contacts |
| Commercial | Vue appelant | Ses contacts uniquement |
| Support | Écoute appels | Lecture contacts |

---

## Troubleshooting : Problèmes courants

### Problème 1 : Synchronisation lente

**Symptôme** : Les données mettent plusieurs minutes à apparaître dans le CRM

**Causes possibles :**
- Rate limiting de l'API CRM
- Webhook non reçu
- Queue de traitement saturée

**Solutions :**
1. Vérifier les quotas API du CRM
2. Tester le webhook avec un outil (webhook.site)
3. Augmenter la fréquence de sync si batch

### Problème 2 : Contact non trouvé

**Symptôme** : L'IA ne reconnaît pas un client existant

**Causes possibles :**
- Format de téléphone différent (+41 vs 0...)
- Numéro dans un champ non recherché
- Contact archivé ou supprimé

**Solutions :**
1. Normaliser les numéros (format E.164)
2. Rechercher dans tous les champs téléphone
3. Vérifier les filtres de recherche CRM

### Problème 3 : Doublons créés

**Symptôme** : Plusieurs fiches contact pour la même personne

**Causes possibles :**
- Recherche insuffisante avant création
- Variantes de nom/email
- Sync bidirectionnelle mal configurée

**Solutions :**
1. Améliorer la logique de déduplication
2. Utiliser des identifiants uniques
3. Activer la détection de doublons CRM

### Problème 4 : Erreurs d'authentification

**Symptôme** : "Invalid token" ou "Unauthorized"

**Causes possibles :**
- Token expiré
- Permissions modifiées côté CRM
- URL d'instance incorrecte

**Solutions :**
1. Régénérer le token / ré-autoriser
2. Vérifier les scopes dans le CRM
3. Mettre à jour l'URL si migration

### Monitoring recommandé

Mettez en place des alertes pour :
- Taux d'erreur API > 5%
- Temps de réponse > 2 secondes
- Token proche de l'expiration
- Volume de sync inhabituel

---

## Conclusion : L'intégration CRM, multiplicateur de valeur

Un assistant vocal IA connecté à votre CRM transforme chaque appel en **données actionnables**. Plus de ressaisie, plus d'oublis, plus d'opportunités manquées.

Les bénéfices sont immédiats :
- **Gain de temps** : 15-20 minutes économisées par commercial par jour
- **Qualité des données** : 100% des appels documentés automatiquement
- **Réactivité** : Suivi des leads en temps réel
- **Intelligence** : Patterns et insights exploitables

L'intégration technique peut sembler complexe, mais les guides de cet article vous permettent de la réaliser étape par étape, quel que soit votre CRM.

### Passez à l'action

Vous souhaitez connecter Aurora AI à votre CRM ?

**[Accéder à la documentation API complète →]**

Ou réservez une consultation technique gratuite avec nos experts intégration :

**[Réserver une consultation technique (30 min) →]**

---

## FAQ : Intégration CRM et assistant IA

**Mon CRM n'est pas dans la liste, est-ce compatible ?**
Si votre CRM dispose d'une API REST, l'intégration est généralement possible. Contactez-nous pour une évaluation technique gratuite.

**L'intégration ralentit-elle l'assistant vocal ?**
Non, les requêtes CRM sont asynchrones ou optimisées. L'impact sur le temps de réponse est inférieur à 200ms.

**Que se passe-t-il si le CRM est indisponible ?**
Aurora continue de fonctionner et stocke les données localement. La synchronisation reprend automatiquement quand le CRM est accessible.

**Puis-je personnaliser les champs synchronisés ?**
Oui, le mapping est entièrement configurable. Vous pouvez aussi créer des champs personnalisés dans votre CRM pour les données spécifiques Aurora.

**Y a-t-il un coût supplémentaire pour l'intégration ?**
Nos solutions s'intègrent nativement avec les leaders du marché (Salesforce, HubSpot, Pipedrive). Pour les CRM propriétaires ou spécifiques, nos experts étudient la faisabilité sur mesure.

---

*Article mis à jour en janvier 2025. Les captures d'écran et interfaces peuvent varier selon les versions des CRM.*

**Mots-clés :** intégration assistant IA CRM, connecter IA Salesforce, automatisation CRM téléphone, synchronisation données client IA, API assistant vocal, HubSpot intégration vocale
