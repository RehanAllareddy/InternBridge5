#!/usr/bin/env python3
"""
Backend API Test Suite for InternBridge
Tests all API endpoints including the AI scraper functionality
"""
import requests
import time
import sys
from datetime import datetime

# Base URL from frontend/.env
BASE_URL = "https://bridge-internships.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def log_test(test_name, status, message=""):
    """Log test result with color coding"""
    if status == "PASS":
        print(f"{Colors.GREEN}✓ {test_name}: PASS{Colors.RESET}")
    elif status == "FAIL":
        print(f"{Colors.RED}✗ {test_name}: FAIL{Colors.RESET}")
        if message:
            print(f"  {Colors.RED}Error: {message}{Colors.RESET}")
    elif status == "INFO":
        print(f"{Colors.BLUE}ℹ {test_name}: {message}{Colors.RESET}")
    elif status == "WARN":
        print(f"{Colors.YELLOW}⚠ {test_name}: {message}{Colors.RESET}")

def test_health_check():
    """Test 1: GET /api/ → returns {"message": "InternBridge API", "status": "ok"}"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 1: Health Check (GET /api/){Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        log_test("Health Check - Status Code", "INFO", f"{response.status_code}")
        
        if response.status_code != 200:
            log_test("Health Check", "FAIL", f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        log_test("Health Check - Response", "INFO", str(data))
        
        if data.get("message") == "InternBridge API" and data.get("status") == "ok":
            log_test("Health Check", "PASS")
            return True
        else:
            log_test("Health Check", "FAIL", f"Unexpected response: {data}")
            return False
    except Exception as e:
        log_test("Health Check", "FAIL", str(e))
        return False

def test_get_internships():
    """Test 2: GET /api/internships → returns array with ~222 internship objects"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 2: Get Internships (GET /api/internships){Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/internships", timeout=10)
        log_test("Get Internships - Status Code", "INFO", f"{response.status_code}")
        
        if response.status_code != 200:
            log_test("Get Internships", "FAIL", f"Expected 200, got {response.status_code}")
            return False, 0
        
        data = response.json()
        
        if not isinstance(data, list):
            log_test("Get Internships", "FAIL", "Response is not an array")
            return False, 0
        
        count = len(data)
        log_test("Get Internships - Count", "INFO", f"{count} internships")
        
        # Check if we have approximately 222 seeded internships
        if count < 222:
            log_test("Get Internships", "FAIL", f"Expected ~222 internships, got {count}")
            return False, count
        
        # Verify structure of first internship
        if count > 0:
            first = data[0]
            required_fields = ['id', 'field', 'title', 'location', 'deadline', 'grade', 'url', 'source']
            missing_fields = [f for f in required_fields if f not in first]
            
            if missing_fields:
                log_test("Get Internships - Structure", "FAIL", f"Missing fields: {missing_fields}")
                return False, count
            
            log_test("Get Internships - Structure", "PASS", f"All required fields present")
            
            # Count seed vs scraper sources
            seed_count = sum(1 for i in data if i.get('source') == 'seed')
            scraper_count = sum(1 for i in data if i.get('source') == 'scraper')
            log_test("Get Internships - Sources", "INFO", f"seed={seed_count}, scraper={scraper_count}")
        
        log_test("Get Internships", "PASS", f"Retrieved {count} internships")
        return True, count
    except Exception as e:
        log_test("Get Internships", "FAIL", str(e))
        return False, 0

def test_get_stats():
    """Test 3: GET /api/internships/stats → returns stats with total >= 222"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 3: Get Stats (GET /api/internships/stats){Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/internships/stats", timeout=10)
        log_test("Get Stats - Status Code", "INFO", f"{response.status_code}")
        
        if response.status_code != 200:
            log_test("Get Stats", "FAIL", f"Expected 200, got {response.status_code}")
            return False, {}
        
        data = response.json()
        log_test("Get Stats - Response", "INFO", str(data))
        
        required_fields = ['total', 'fields', 'locations', 'last_scrape', 'last_scrape_added']
        missing_fields = [f for f in required_fields if f not in data]
        
        if missing_fields:
            log_test("Get Stats - Structure", "FAIL", f"Missing fields: {missing_fields}")
            return False, data
        
        total = data.get('total', 0)
        if total < 222:
            log_test("Get Stats", "FAIL", f"Expected total >= 222, got {total}")
            return False, data
        
        log_test("Get Stats", "PASS", f"Total: {total}, Fields: {data.get('fields')}, Locations: {data.get('locations')}")
        return True, data
    except Exception as e:
        log_test("Get Stats", "FAIL", str(e))
        return False, {}

def test_trigger_scrape():
    """Test 4: POST /api/admin/scrape → triggers background scrape"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 4: Trigger Scrape (POST /api/admin/scrape){Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    try:
        response = requests.post(f"{BASE_URL}/admin/scrape", timeout=10)
        log_test("Trigger Scrape - Status Code", "INFO", f"{response.status_code}")
        
        if response.status_code != 200:
            log_test("Trigger Scrape", "FAIL", f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        log_test("Trigger Scrape - Response", "INFO", str(data))
        
        if 'message' not in data or 'started_at' not in data:
            log_test("Trigger Scrape", "FAIL", f"Missing required fields in response")
            return False
        
        message = data.get('message', '')
        if 'Scrape started in background' in message or 'Scrape already in progress' in message:
            log_test("Trigger Scrape", "PASS", message)
            return True
        else:
            log_test("Trigger Scrape", "FAIL", f"Unexpected message: {message}")
            return False
    except Exception as e:
        log_test("Trigger Scrape", "FAIL", str(e))
        return False

def test_scrape_status_polling():
    """Test 5: GET /api/admin/scrape/status → poll for scrape completion (up to 2 minutes)"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 5: Poll Scrape Status (GET /api/admin/scrape/status){Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    max_wait = 120  # 2 minutes
    poll_interval = 10  # 10 seconds
    elapsed = 0
    
    try:
        while elapsed < max_wait:
            response = requests.get(f"{BASE_URL}/admin/scrape/status", timeout=10)
            
            if response.status_code != 200:
                log_test("Scrape Status", "FAIL", f"Expected 200, got {response.status_code}")
                return False, None
            
            data = response.json()
            
            if 'runs' not in data or not isinstance(data['runs'], list):
                log_test("Scrape Status", "FAIL", "Invalid response structure")
                return False, None
            
            if len(data['runs']) == 0:
                log_test("Scrape Status", "WARN", "No scrape runs found yet")
                time.sleep(poll_interval)
                elapsed += poll_interval
                continue
            
            latest_run = data['runs'][0]
            status = latest_run.get('status', 'unknown')
            
            log_test("Scrape Status - Poll", "INFO", f"Status: {status}, Elapsed: {elapsed}s")
            
            if status == 'completed':
                log_test("Scrape Status - Completed", "INFO", str(latest_run))
                
                # Verify required fields
                required_fields = ['queries_searched', 'candidates_found', 'new_added', 'duration_seconds']
                missing_fields = [f for f in required_fields if f not in latest_run]
                
                if missing_fields:
                    log_test("Scrape Status", "FAIL", f"Missing fields in completed run: {missing_fields}")
                    return False, latest_run
                
                queries = latest_run.get('queries_searched', 0)
                candidates = latest_run.get('candidates_found', 0)
                new_added = latest_run.get('new_added', 0)
                duration = latest_run.get('duration_seconds', 0)
                
                if queries <= 0:
                    log_test("Scrape Status", "FAIL", f"queries_searched should be > 0, got {queries}")
                    return False, latest_run
                
                if duration <= 0:
                    log_test("Scrape Status", "FAIL", f"duration_seconds should be > 0, got {duration}")
                    return False, latest_run
                
                log_test("Scrape Status", "PASS", 
                        f"Queries: {queries}, Candidates: {candidates}, New: {new_added}, Duration: {duration:.2f}s")
                return True, latest_run
            
            elif status == 'failed':
                error = latest_run.get('error', 'Unknown error')
                log_test("Scrape Status", "FAIL", f"Scrape failed: {error}")
                return False, latest_run
            
            elif status == 'running':
                log_test("Scrape Status", "INFO", f"Still running... waiting {poll_interval}s")
                time.sleep(poll_interval)
                elapsed += poll_interval
            else:
                log_test("Scrape Status", "WARN", f"Unknown status: {status}")
                time.sleep(poll_interval)
                elapsed += poll_interval
        
        log_test("Scrape Status", "FAIL", f"Timeout after {max_wait}s - scrape did not complete")
        return False, None
        
    except Exception as e:
        log_test("Scrape Status", "FAIL", str(e))
        return False, None

def test_stats_after_scrape(stats_before, scrape_run):
    """Test 6: Verify stats updated after scrape"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 6: Verify Stats After Scrape{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/internships/stats", timeout=10)
        
        if response.status_code != 200:
            log_test("Stats After Scrape", "FAIL", f"Expected 200, got {response.status_code}")
            return False
        
        stats_after = response.json()
        log_test("Stats After Scrape - Response", "INFO", str(stats_after))
        
        total_before = stats_before.get('total', 0)
        total_after = stats_after.get('total', 0)
        new_added = scrape_run.get('new_added', 0) if scrape_run else 0
        
        log_test("Stats Comparison", "INFO", 
                f"Before: {total_before}, After: {total_after}, New Added: {new_added}")
        
        if new_added > 0:
            expected_total = total_before + new_added
            if total_after == expected_total:
                log_test("Stats After Scrape", "PASS", 
                        f"Total increased correctly: {total_before} + {new_added} = {total_after}")
                return True
            else:
                log_test("Stats After Scrape", "FAIL", 
                        f"Expected total {expected_total}, got {total_after}")
                return False
        else:
            log_test("Stats After Scrape", "PASS", 
                    f"No new internships added (new_added=0), total unchanged: {total_after}")
            return True
            
    except Exception as e:
        log_test("Stats After Scrape", "FAIL", str(e))
        return False

def test_recent_internships():
    """Test 7: GET /api/internships/recent?limit=10 → returns recently scraped internships"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test 7: Get Recent Internships (GET /api/internships/recent?limit=10){Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/internships/recent?limit=10", timeout=10)
        log_test("Recent Internships - Status Code", "INFO", f"{response.status_code}")
        
        if response.status_code != 200:
            log_test("Recent Internships", "FAIL", f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if not isinstance(data, list):
            log_test("Recent Internships", "FAIL", "Response is not an array")
            return False
        
        count = len(data)
        log_test("Recent Internships - Count", "INFO", f"{count} recent internships")
        
        # Verify all have source='scraper'
        if count > 0:
            non_scraper = [i for i in data if i.get('source') != 'scraper']
            if non_scraper:
                log_test("Recent Internships", "FAIL", 
                        f"{len(non_scraper)} items don't have source='scraper'")
                return False
            
            log_test("Recent Internships", "PASS", 
                    f"Retrieved {count} recent internships (all from scraper)")
        else:
            log_test("Recent Internships", "PASS", 
                    "No recent scraped internships (acceptable if scraper found no new items)")
        
        return True
        
    except Exception as e:
        log_test("Recent Internships", "FAIL", str(e))
        return False

def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}InternBridge Backend API Test Suite{Colors.RESET}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    results = {}
    
    # Test 1: Health Check
    results['health_check'] = test_health_check()
    
    # Test 2: Get Internships
    results['get_internships'], internship_count = test_get_internships()
    
    # Test 3: Get Stats (before scrape)
    results['get_stats_before'], stats_before = test_get_stats()
    
    # Test 4: Trigger Scrape
    results['trigger_scrape'] = test_trigger_scrape()
    
    # Test 5: Poll Scrape Status
    results['scrape_status'], scrape_run = test_scrape_status_polling()
    
    # Test 6: Verify Stats After Scrape
    if results['get_stats_before'] and results['scrape_status']:
        results['stats_after_scrape'] = test_stats_after_scrape(stats_before, scrape_run)
    else:
        results['stats_after_scrape'] = False
        log_test("Stats After Scrape", "FAIL", "Skipped due to previous failures")
    
    # Test 7: Get Recent Internships
    results['recent_internships'] = test_recent_internships()
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Test Summary{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "PASS" if result else "FAIL"
        log_test(test_name, status)
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    if passed == total:
        print(f"{Colors.GREEN}All tests passed! ({passed}/{total}){Colors.RESET}")
        return 0
    else:
        print(f"{Colors.RED}Some tests failed. ({passed}/{total} passed){Colors.RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
