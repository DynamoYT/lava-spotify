"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const spotifyPattern = /(?:https:\/\/open\.spotify\.com\/|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+)/;
class LavaSpotify {
    constructor(node, options) {
        this.node = node;
        this.options = options;
        this.baseURL = "https://api.spotify.com/v1";
        this.token = null;
        void this.requestToken();
    }
    load(url) {
        var _a;
        const typeFuncs = {
            album: this.getAlbum.bind(this),
            playlist: this.getPlaylist.bind(this),
            track: this.getTrack.bind(this)
        };
        const [, type, id] = (_a = spotifyPattern.exec(url)) !== null && _a !== void 0 ? _a : [];
        return typeFuncs[type](id, true);
    }
    getAlbum(id, asLavaTrack = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const album = yield (yield node_fetch_1.default(`${this.baseURL}/albums/${id}`, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            return asLavaTrack ? {
                loadType: "PLAYLIST_LOADED",
                playlistInfo: {
                    name: album.name
                },
                tracks: yield Promise.all(album.tracks.items.map(x => this.resolve(x)))
            } : album;
        });
    }
    getPlaylist(id, asLavaTrack = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield (yield node_fetch_1.default(`${this.baseURL}/playlists/${id}`, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            return asLavaTrack ? {
                loadType: "PLAYLIST_LOADED",
                playlistInfo: {
                    name: playlist.name
                },
                tracks: yield Promise.all(playlist.tracks.items.map(x => this.resolve(x)))
            } : playlist;
        });
    }
    getTrack(id, asLavaTrack = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const track = yield (yield node_fetch_1.default(`${this.baseURL}/tracks/${id}`, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            return asLavaTrack ? {
                loadType: "TRACK_LOADED",
                playlistInfo: {},
                tracks: [yield this.resolve(track)]
            } : track;
        });
    }
    resolve(track) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
            }).toString();
            return yield (yield node_fetch_1.default(`http://${this.node.host}:${this.node.port}/loadtracks?${params}`, {
                headers: {
                    Authorization: this.node.password
                }
            })).json();
        });
    }
    requestToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64");
            const { access_token, token_type, expires_in } = yield (yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })).json();
            this.token = `${token_type} ${access_token}`;
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(this.requestToken.bind(this), expires_in * 1000);
        });
    }
}
exports.default = LavaSpotify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVNwb3RpZnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9MYXZhU3BvdGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLDREQUErQjtBQUUvQixNQUFNLGNBQWMsR0FBRyx5RkFBeUYsQ0FBQztBQUVqSCxNQUFxQixXQUFXO0lBSTVCLFlBQTBCLElBQWtCLEVBQVMsT0FBdUI7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBYztRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSDNELFlBQU8sR0FBRyw0QkFBNEIsQ0FBQztRQUNoRCxVQUFLLEdBQWtCLElBQUksQ0FBQztRQUdoQyxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQVc7O1FBQ25CLE1BQU0sU0FBUyxHQUFHO1lBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMvQixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsU0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7UUFDcEQsT0FBTyxTQUFTLENBQUMsSUFBOEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQW1DLENBQUM7SUFDakcsQ0FBQztJQUtZLFFBQVEsQ0FBQyxFQUFVLEVBQUUsV0FBVyxHQUFHLEtBQUs7O1lBQ2pELE1BQU0sS0FBSyxHQUFpQixNQUFNLENBQUMsTUFBTSxvQkFBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sV0FBVyxFQUFFLEVBQUUsRUFBRTtnQkFD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