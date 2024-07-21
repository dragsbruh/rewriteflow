export interface FlowAnalytics {
  calls: number;
  success: number;
  failure: number;
}

export interface Flow {
  id: string;
  name: string;
  author: string;
  created_at: number;
  last_modified: number;
  analytics: FlowAnalytics;
  env: { [key: string]: string };
}

export interface PublicFlow {
  id: string;
  name: string;
  author: string;
  created_at: number;
}

export interface User {
  id: string;
  username: string;
  created_at: number;
}

async function fetchWrapper(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const errorText = await response.text();
    let message;
    try {
      let jsonErr = JSON.parse(errorText);
      message = jsonErr.detail || jsonErr.message || errorText;
    } catch (e) {
      message = errorText;
    }
    throw new Error(message);
  }

  return response;
}

export class RewriteFlow {
  private _baseUrl: string;
  private _token: string | null;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._token = localStorage.getItem("rf-token");
  }

  private setToken(token: string) {
    this._token = token;
    localStorage.setItem("rf-token", token);
  }

  public unsetToken() {
    this._token = null;
    localStorage.removeItem("rf-token");
  }

  public register(username: string, email: string): Promise<User> {
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      })
        .then((response) => {
          response.json().then((user: User) => {
            resolve(user);
          });
        })
        .catch((err) => reject(err));
    });
  }

  public authenticate(token: string): Promise<User> {
    this.setToken(token);
    return new Promise((resolve, reject) => {
      this.me()
        .then((user: User) => {
          resolve(user);
        })
        .catch((err) => {
          this.unsetToken();
          reject(err);
        });
    });
  }

  public me(): Promise<User> {
    this.ensureToken();
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/auth/me`, {
        headers: {
          Authorization: `${this._token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) =>
          response.json().then((user: User) => {
            resolve(user);
          })
        )
        .catch((err) => reject(err));
    });
  }

  // public newFlow(
  //   code: string,
  //   environment: { [key: string]: string }
  // ): Promise<Flow> {
  //   this.ensureToken();
  //   return new Promise((resolve, reject) => {
  //     fetchWrapper(`${this._baseUrl}/flows/new`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `${this._token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ code, env: environment }),
  //     })
  //       .then((response) =>
  //         response.json().then((flow: Flow) => {
  //           resolve(flow);
  //         })
  //       )
  //       .catch((err) => reject(err));
  //   });
  // }

  public getFlow(id: string): Promise<PublicFlow> {
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/flows/flow/${id}`)
        .then((response) =>
          response.json().then((flow: PublicFlow) => {
            resolve(flow);
          })
        )
        .catch((err) => reject(err));
    });
  }

  public getMyFlow(id: string): Promise<Flow> {
    this.ensureToken();
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/flows/my/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this._token}`,
        },
      })
        .then((response) =>
          response.json().then((flow: Flow) => {
            resolve(flow);
          })
        )
        .catch((err) => reject(err));
    });
  }

  public updateFlowEnv(
    id: string,
    environment: { [key: string]: string }
  ): Promise<void> {
    this.ensureToken();
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/flows/update_env/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `${this._token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, env: environment }),
      })
        .then((response) => resolve(undefined))
        .catch((err) => reject(err));
    });
  }

  // public updateFlow(id: string, code: string): Promise<void> {
  //   this.ensureToken();
  //   return new Promise((resolve, reject) => {
  //     fetchWrapper(`${this._baseUrl}/flows/update/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `${this._token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id, code }),
  //     })
  //       .then((response) => resolve(undefined))
  //       .catch((err) => reject(err));
  //   });
  // }

  public getMyFlows(): Promise<Flow[]> {
    this.ensureToken();
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/flows/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this._token}`,
        },
      })
        .then((response) =>
          response.json().then((flows: Flow[]) => {
            resolve(flows);
          })
        )
        .catch((err) => reject(err));
    });
  }

  public getMyCode(flowId: string): Promise<string> {
    this.ensureToken();
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/flows/my/${flowId}/code`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this._token}`,
        },
      })
        .then((response) => response.json().then((code) => resolve(code)))
        .catch((err) => reject(err));
    });
  }

  public isAuthenticated(): boolean {
    return !!this._token;
  }

  public logout(): void {
    this.unsetToken();
  }

  private ensureToken() {
    if (!this._token) {
      throw new Error("No token set");
    }
  }

  public reportAbuse(username: string, message: string) {
    return new Promise((resolve, reject) => {
      fetchWrapper(`${this._baseUrl}/misc/report_abuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, message }),
      })
        .then((response) => resolve(undefined))
        .catch((err) => reject(err));
    });
  }
}

export function calcSuccessRate(flow: Flow) {
  return Number.parseFloat(
    (flow.analytics.calls !== 0
      ? (flow.analytics.success / flow.analytics.calls) * 100
      : 100
    ).toPrecision(4)
  );
}

export function generateDemoToken() {
  const randomBytes = new Uint8Array(16); // 16 bytes = 128 bits
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export var rf = new RewriteFlow("http://localhost"); // will update once testing
