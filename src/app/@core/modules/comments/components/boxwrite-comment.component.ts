import { UiEventsService } from './../services/ui-events.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  forwardRef,
  ChangeDetectorRef,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { Comment } from '../models/comment.class';
const placeHolders = {
  default: 'Deja tu comentario',
  reply: 'Respondiendo a {nameUser}'
};

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import format from 'string-template';
@Component({
  selector: 'app-write-comment',
  template: `
    <mat-form-field [ngStyle]="styleBox">
      <mat-label> {{ placeHolderBox }} </mat-label>
      <textarea
        [(ngModel)]="inputValue"
        name="inputValue"
        matInput
        (input)="eventWriteComment($event)"
        (Keyup.enter)="handleSubmit()"
        cols="30"
        rows="3"
      >
      </textarea>
      <emoji-mart
        *ngIf="visiblePickerIcon"
        [style]="{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 5
        }"
        (emojiClick)="emogiClick($event)"
      ></emoji-mart>

      <mat-hint align="end">
        {{ inputValue?.length }} / {{ MAX_LENGHT }}
      </mat-hint>
      <mat-hint>
        <nz-form-item>
          <button
            nz-button
            nzType="primary"
            (click)="handleSubmit()"
            [hidden]="inputValue.length == 0"
          >
            comentar
          </button>
          <!-- <ul class="bars">
        <a (click)="visiblePickerIcon = !visiblePickerIcon">
          <i class="far fa-smile-beam icon"></i>
        </a>
      </ul> -->
        </nz-form-item>
      </mat-hint>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 25px 0;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BoxwriteCommentComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class BoxwriteCommentComponent implements OnInit, ControlValueAccessor {
  inputValue: string = '';
  private onChangue: (data: string) => void;
  private onTouch: () => void;
  visiblePickerIcon = false;
  public MAX_LENGHT = 150;

  public placeHolderBox = '';

  public parentComment: Comment;

  private _styleBox: CSSStyleDeclaration;

  @Input() @InputBoolean() inReply: boolean;
  @Output() onComment = new EventEmitter<string>();

  constructor(
    private detection: ChangeDetectorRef,
    private uiEventsService: UiEventsService
  ) {}

  ngOnInit(): void {
    this.listenSubjects();
  }

  private listenSubjects() {
    if (this.inReply) {
      this.uiEventsService
        .onEventRespondComment('openReply')
        .subscribe((payload) => {
          this.parentComment = payload.parentComment;
          this.placeHolderBox = format(placeHolders.reply, {
            nameUser: payload.parentComment.user.name
          });
        });
    }
  }

  public writeValue(defaultValue: string): void {
    if (defaultValue?.length) {
      this.inputValue = defaultValue;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangue = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  /*=============================================
  =            DOM EVENTS            =
  =============================================*/
  public handleSubmit(): void {
    if (this.inputValue.length > 1) {
      this.onComment.emit(this.inputValue);
      this.inputValue = '';
    }
  }
  eventWriteComment($event: InputEvent) {
    if (this.inputValue.length >= this.MAX_LENGHT || $event.data === null) {
      ($event.target as HTMLTextAreaElement).value = this.inputValue.substr(
        0,
        this.inputValue.length - 1
      );
    }
  }

  /*=============================================
 =            helpers            =
 =============================================*/
  get styleBox() {
    this._styleBox = {} as CSSStyleDeclaration;
    if (this.inReply) {
      this._styleBox.width = '600px';
      this._styleBox.marginLeft = '25px';
      this._styleBox.marginTop = '-10px';
    } else {
      this._styleBox.width = '100%';
    }

    return this._styleBox;
  }

  /*=============================================
=            Events Emit            =
=============================================*/
  emogiClick({ emoji }) {
    this.inputValue += emoji.native;
    this.visiblePickerIcon = false;
  }
}
