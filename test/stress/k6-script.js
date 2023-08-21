import http from 'k6/http';

export default function () {
  let fnfSvc = __ENV.FAST_N_FOODIOUS_SVC || '127.0.0.1';
  http.get(`http://${fnfSvc}/v1/categoria`);
}

//docker run --rm -i 24hoursmedia/k6-xarch run -e FAST_N_FOODIOUS_SVC=$(kubectl get svc fast-n-foodious-svc -o jsonpath='{.spec.clusterIP}') --vus 20 --duration 120s -< test/stress/k6-script.js
//docker run --rm -i grafana/k6 run -e FAST_N_FOODIOUS_SVC=$(kubectl get svc fast-n-foodious-svc -o jsonpath='{.spec.clusterIP}') --vus 20 --duration 120s -< test/stress/k6-script.js