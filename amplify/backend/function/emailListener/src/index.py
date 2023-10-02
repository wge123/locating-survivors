import json
import time
import boto3
import imaplib
import email
import time

lambda_client = boto3.client('lambda')





def listen_and_scrape_email(case_id):
        minutes = 1 * 60
        sleep_seconds = 2
        email_handle = "locatingsurvivorsemailtest"
        
        # Log in to your Gmail account and navigate to the inbox
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login('locatingsurvivorsemailtest@gmail.com', 'vgfz ecvi epll kzzw')
        mail.select('Inbox')

        start_time = time.time()
        case_address = f"{email_handle}+{case_id}@gmail.com"

        
        email_counter = 0
        ## infinite loop to listen and scrape email
        while True:
            # Check if alloted listening time has passed
            if time.time() - start_time > (minutes):
                break

            # Check for new incoming messages only to specific case address
            result, data = mail.search(None, 'UNSEEN', 'TO', case_address)
            
            # checks if mail search worked
            if result == 'OK':
                # loops over data returned from search
                for num in data[0].split():
                    # Retrieve the email by sequential ID, this includes all the metadata
                    _, msg_data = mail.fetch(num, '(RFC822)')
                    # extracts just the email portion
                    raw_email = msg_data[0][1]
                    email_message = email.message_from_bytes(raw_email)
                    # still needs to check if the message is going to specific address
                    if case_address in email_message['To']:
                        ## goes through message to extract only the body
                        for part in email_message.walk():
                            if part.get_content_type() == "text/plain":
                                body = part.get_payload(decode=True)
                                body = body.decode()
                                break
                        email_counter+=1        
                        print(f"EMAIL # {email_counter} FOUND") 
                        # invoke emailScraper
                        print(body)
                        lambda_payload = json.dumps(body)
                        lambda_client.invoke(FunctionName='emailScraper-will', 
                     InvocationType='Event',
                     Payload=lambda_payload)
                        
                    
            # keeps email listener from timing out
            mail.noop()
            time.sleep(sleep_seconds)

        











def handler(event, context):
    case_id = event.get("case_id")
    listen_and_scrape_email(case_id)
    