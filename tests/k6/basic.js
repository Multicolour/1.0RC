import http from "k6/http"
import { check } from "k6"
import { Rate } from "k6/metrics"

// A custom metric to track failure rates
const failureRate = new Rate("check_failure_rate")

// Options
export const options = {
  stages: [
    { target: 250, duration: "1m" },
    { target: 250, duration: "3m30s" },
    { target: 0, duration: "30s" },
  ],
  thresholds: {
    // We want the 95th percentile of all HTTP request durations to be less than 500ms
    http_req_duration: ["p(95)<500"],
    // Thresholds based on the custom metric we defined and use to track application failures
    check_failure_rate: [
      // Global failure rate should be less than 1%
      "rate<0.01",
      // Abort the test early if it climbs over 5%
      { threshold: "rate<=0.05", abortOnFail: true },
    ],
  },
}

// Main function
export default function() {
  const response1811 = http.get("http://localhost:1811")
  const response1812 = http.get("http://localhost:1812")
  const response1813 = http.get("http://localhost:1813")

  // check() returns false if any of the specified conditions fail
  const checkRes1811 = check(response1811, {
    "status is 200": r => r.status === 200,
  })
  const checkRes1812 = check(response1812, {
    "status is 200": r => r.status === 200,
  })
  const checkRes1813 = check(response1813, {
    "status is 200": r => r.status === 200,
  })

  // We reverse the check() result since we want to count the failures
  failureRate.add(!checkRes1811)
  failureRate.add(!checkRes1812)
  failureRate.add(!checkRes1813)
}
