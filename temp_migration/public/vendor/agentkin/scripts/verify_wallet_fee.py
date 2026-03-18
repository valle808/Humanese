import argparse

def simulate_transaction(amount, currency="SOL"):
    print(f"\n--- Simulating {amount} {currency} Transaction ---")
    
    # Fee Logic
    total_fee_percent = 0.06
    surcharge_percent = 0.03 # Paid by Creator
    deduction_percent = 0.03 # Paid by Worker
    
    # 1. Task Creation (Creator Pays Budget + 3%)
    surcharge = amount * surcharge_percent
    total_charged_to_creator = amount + surcharge
    
    print(f"[STEP 1] Task Creation")
    print(f"  - Budget:       {amount:10.4f} {currency}")
    print(f"  - Surcharge (3%): {surcharge:8.4f} {currency}  -> Vault: PLATFORM_REVENUE")
    print(f"  - Total Charged:  {total_charged_to_creator:10.4f} {currency}")
    
    # 2. Task Completion (Worker Paid Budget - 3%)
    deduction = amount * deduction_percent
    payout_to_worker = amount - deduction
    
    print(f"[STEP 2] Task Completion & Payout")
    print(f"  - Deduction (3%): {deduction:8.4f} {currency}  -> Vault: PLATFORM_REVENUE")
    print(f"  - Worker Payout:  {payout_to_worker:10.4f} {currency}")
    
    # Summary
    total_platform_revenue = surcharge + deduction
    print(f"\n[SUMMARY] Financial Verification")
    print(f"  - Total Platform Revenue (6%): {total_platform_revenue:10.4f} {currency}")
    print(f"  - Worker Receives (97%):       {payout_to_worker:10.4f} {currency}")
    
    assert abs(total_platform_revenue - (amount * 0.06)) < 0.0001, "Fee Calculation Error!"
    print("\n[VERIFIED] Fee Calculation Logic is Correct. ✅")

if __name__ == "__main__":
    simulate_transaction(1000, "SOL")
    simulate_transaction(5000, "XRP")

#   ____                    _         _                
#  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
# | |   | '__/ _ \/ _` |/ _` |/ _ \  | '_ \| | | |     
# | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
#  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
#  ____                 _        __     __  |___/      
# / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
# \___ \ / _ \ '__/ _` | |/ _ \   \ \ / / _` | | |/ _ \
#  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
# |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
#                 |___/    
#
# Sergiio Valle Bastidas - valle808@hawaii.edu
# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
